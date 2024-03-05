import yup from 'yup';

export default async function(formData, edit = false) {
	const schema = yup.object({
		title: yup.string().required('Title is required').min(4).max(40),
		author: yup.string().required('Author is required').min(5).max(200),
		short_description: yup.string().required('Short description is required').min(5).max(200),
		description: yup.string().required('Description is required').min(5).max(450),
		small_picture: fileValidation('Small picture', edit),
		main_picture: fileValidation('Main picture', edit)
	});
	const data = {
		title: formData.get('title'),
		author: formData.get('author'),
		short_description: formData.get('short_description'),
		description: formData.get('description'),
		small_picture: formData.get('small_picture'),
		main_picture: formData.get('main_picture')
	};

	try {
		await schema.validate(data, { abortEarly: false });
		return { success: true, book: data };
	} catch (e) {
		const errors = e.inner.reduce((agg, err) => {
			if (!agg['error_' + err.path]) {
				agg['error_' + err.path] = err.message;
			}
			return agg;
		}, {});

		delete data.small_picture;
		delete data.main_picture;


		return { ...errors, ...data, success: false };
	}
}


/**
 * @param {string} message
 * @param {boolean} edit
 */
function fileValidation(message, edit) {
	return yup
		.mixed()
		.nullable()
		.test('fileRequired', `${message} required`, (value) => {
			if (edit) {
				return true;
			}
			return value && value.size;
		})
		.test('fileType', 'This value must be an image', (value) => {
			if (edit) {
				return true;
			}
			if (value && value.type) {
				return ['image/png', 'image/jpeg', 'image/gif'].includes(value.type);
			}
			return true;
		}).test('fileSize', 'This file must be under 4 MB', (value) => {
			if (edit) {
				return true;
			}
			if (value && value.size) {
				return value.size < 4_000_000;
			}
			return true;
		});
}