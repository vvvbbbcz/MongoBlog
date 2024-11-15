import User from "~/server/utils/models/User";

function filter(body: any) {
	return {
		username: body.username,
		password: body.password
	};
}

export default defineEventHandler(async (event) => {
	const body = await filter(await readBody(event));

	if (process.env.INSTALL) {
		// 'installer'
		const hashedPassword = await hashPassword('9c0d294c05fc1d88d698034609bb81c0c69196327594e4c69d2915c80fd9850c')
		const isValid = (body.username === 'installer') &&
			(await verifyPassword(hashedPassword, body.password));
		if (!isValid) {
			setResponseStatus(event, 422);
			return null;
		}

		await setUserSession(event, {
			user: {
				id: -1,
				username: 'installer',
			},
			loggedInAt: new Date()
		});
	} else {
		const user: any = await User.findOne({username: body.username}).select('+password').exec().catch(error => {
			console.error(error);
		});
		if (!user) {
			setResponseStatus(event, 422);
			return null;
		}

		if (!await verifyPassword(user.password, body.password)) {
			setResponseStatus(event, 422);
			return null;
		}

		await setUserSession(event, {
			user: {
				id: user._id,
				username: body.username,
			},
			loggedInAt: new Date()
		});
	}
});