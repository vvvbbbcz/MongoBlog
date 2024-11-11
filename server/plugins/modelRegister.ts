import Article from "~/server/utils/models/Article";
import Tag from "~/server/utils/models/Tag";
import BlogInfo from "~/server/utils/models/BlogInfo";
import DeletedArticle from "~/server/utils/models/DeletedArticle";
import Draft from "~/server/utils/models/Draft";
import Picture from "~/server/utils/models/Picture";
import User from "~/server/utils/models/User";

export default defineNitroPlugin((): void => {
    const models = [
        Article,
        BlogInfo,
        DeletedArticle,
        Draft,
        Picture,
        Tag,
        User
    ];
    console.log('Registered ' + models.length + ' Mongoose model(s)');
})