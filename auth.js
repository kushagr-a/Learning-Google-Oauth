import { Router } from 'express';
import { config } from "./config.js"

const authRouter = Router();

const stateStore = new Set()

authRouter.get("/google", (req, res) => {
    const state = crypto.randomUUID()
    stateStore.add(state)

    const params = new URLSearchParams({
        client_id: config.google.GOOGLE_CLIENT_ID,
        redirect_uri: config.google.REDIRECT_URI,
        response_type: 'code',
        scope: 'openid email profile',
        state: state,
    })

    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
})

export default authRouter;