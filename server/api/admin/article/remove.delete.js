import Article from "~/server/utils/models/Article";
import DeletedArticle from "~/server/utils/models/DeletedArticle";
import {status} from "~/server/utils/util";

export default defineEventHandler(async (event) => {
	const id = parseInt((await readBody(event))._id);
	if (!isNaN(id)) {
		const model = await Article.findByIdAndDelete(id).exec().catch(error => {
			console.error(error);
		});
		if (!model) {
			setResponseStatus(event, 404);
			return status.error;
		}

		const result = await DeletedArticle.create({...model._doc}).catch(async error => {
			await Article.create({...model._doc}).catch(error => {
				console.error(error);
			});
			console.error(error);
		});
		if (!result) {
			setResponseStatus(event, 500);
			return status.error;
		}

		return status.success;
	}
	setResponseStatus(event, 400);
	return status.error;
});