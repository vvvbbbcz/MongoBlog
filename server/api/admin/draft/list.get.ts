import Draft from "~/server/utils/models/Draft";
import {adminFlush} from "~/server/utils/util";

function removeUnnecessary(data: any[]) {
	for (const item of data) {
		adminFlush(item);
		item.urlName = undefined;
		item.cover = undefined;
		item.markdown = undefined;
	}
	return data;
}

export default defineEventHandler(async (event) => {
	const data = await Draft.find()
		.limit(20)
		.sort({_id: -1})
		.populate(['tagId', 'author'])
		.exec().catch(error => {
			console.error(error);
		});
	if (data) {
		return removeUnnecessary(data);
	} else {
		return [];
	}
});