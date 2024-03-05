import { db } from '$lib/firebase/firebase.server.js';
// import { firestore } from 'firebase-admin';
import firebaseAdmin from 'firebase-admin';
import { saveFileToBucket } from '$lib/firebase/firestorage.server.js';
import { PUBLIC_PAGE_SIZE } from '$env/static/public';

export async function getBooks(userId, page = 1) {
	const user = userId ? await getUser(userId) : null;

	const bookCount = await db.collection('books').count().get();
	const totalBooks = bookCount.data().count;
	const next = totalBooks > (page * +PUBLIC_PAGE_SIZE);
	const previous = page > 1;
	const books = await db.collection('books')
		.limit(+PUBLIC_PAGE_SIZE)
		.offset((page - 1) * +PUBLIC_PAGE_SIZE)
		.orderBy('created_at', 'desc')
		.get();

	const likedBooks = books.docs.map((book) => {
		return { ...book.data(), id: book.id, likedBook: user?.bookIds?.includes(book.id) || false };
	});

	return {
		books: likedBooks,
		next,
		previous
	};
}

export async function addBook(book, userId) {
	const bookCollection = db.collection('books');
	const bookRef = await bookCollection.add({
		title: book.title,
		short_description: book.short_description,
		description: book.description,
		author: book.author,
		user_id: userId,
		created_at: firebaseAdmin.firestore.Timestamp.now().seconds,
		likes: 0
	});

	const smallPictureUrl = await saveFileToBucket(
		book.small_picture,
		`${userId}/${bookRef.id}/small_picture`
	);

	const mainPicture = await saveFileToBucket(
		book.main_picture,
		`${userId}/${bookRef.id}/main_picture`
	);
	await bookRef.update({
		small_picture: smallPictureUrl,
		main_picture: mainPicture
	});

	return bookRef.id;
}

export async function getBook(id, userId = null) {
	const bookRef = await db.collection('books').doc(id).get();

	if (bookRef.exists) {
		const user = userId ? await getUser(userId) : null;
		const likedBook = user?.bookIds?.includes(id) || false;

		return { id: bookRef.id, ...bookRef.data(), likedBook };
	}
}

export async function getUser(id) {
	const user = await db.collection('users').doc(id).get();

	return user?.data();
}

export async function editBook(id, form, userId) {
	const bookRef = await db.collection('books').doc(id);
	let mainPicture = form.main_picture || null;
	let smallPicture = form.small_picture || null;
	delete form.main_picture;
	delete form.small_picture;
	await bookRef.update(form);

	if (mainPicture) {
		const mainPictureUrl = await saveFileToBucket(mainPicture, `${userId}/${bookRef.id}/main_picture`);

		await bookRef.update({ main_picture: mainPictureUrl });
	}

	if (smallPicture) {
		const smallPictureUrl = await saveFileToBucket(smallPicture, `${userId}/${bookRef.id}/main_picture`);
		await bookRef.update({ small_picture: smallPictureUrl });
	}
}

export async function toggleBookLike(bookId, userId) {
	const bookRef = db.collection('books').doc(bookId);
	const userRef = db.collection('users').doc(userId);

	const user = await userRef.get();
	const userData = user.data();
	if (userData.bookIds && userData.bookIds.includes(bookId)) {
		await userRef.update({
			bookIds: firebaseAdmin.firestore.FieldValue.arrayRemove(bookId)
		});
		await bookRef.update({
			likes: firebaseAdmin.firestore.FieldValue.increment(-1)
		});
	} else {
		await userRef.update({
			bookIds: firebaseAdmin.firestore.FieldValue.arrayUnion(bookId)
		});
		await bookRef.update({
			likes: firebaseAdmin.firestore.FieldValue.increment(1)
		});
	}
	return await getBook(bookId, userId);
}

export async function getUserBooks(userId) {
	const user = await getUser(userId);
	const books = await db.collection('books')
		.orderBy('created_at', 'desc')
		.where('user_id', '==', userId)
		.get();

	return books.docs.map((book) => {
		return { ...book.data(), id: book.id, likedBook: user?.bookIds?.includes(book.id) || false };
	});
}

export async function getLikedBooks(userId) {
	const user = await getUser(userId);
	const bookIds = user?.bookIds || [];
	if (bookIds.length === 0) {
		return [];
	}

	const books = await db.collection('books')
		.where(firebaseAdmin.firestore.FieldPath.documentId(), 'in', bookIds).get();

	return books.docs.map((book) => {
		return { ...book.data(), id: book.id, likedBook: true };
	});
}