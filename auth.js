import { Router } from 'express';
import { config } from "./config.js"

const authRouter = Router();

const stateStore = new Set()

authRouter.get("/google", (req, res) => {
    // step number 1: Redirect user to Google's OAuth 2.0 server
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

authRouter.get("/google/callback", async (req, res) => {
    // step number 2: Handle the OAuth 2.0 server response
    const { code, state } = req.query;
    if (!code || !state || !stateStore.has(state)) {
        return res.status(400).send("Invalid Oauth request ");
    }
    stateStore.delete(state)
    // Here you would typically exchange the code for tokens and retrieve user info

    // step number 3: Exchange code for state tokens and retrieve user info
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: "POST",
        headers: {
            "content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            code,
            client_id: config.google.GOOGLE_CLIENT_ID,
            client_secret: config.google.GOOGLE_CLIENT_SECRET,
            redirect_uri: config.google.REDIRECT_URI,
            grant_type: 'authorization_code',
        })
    })

    const token = await tokenRes.json();

    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        }
    })

    const userInfo = await userRes.json();

    res.send({
        message: "User authenticated",
        // token -> never send token like that
        user: userInfo,
    })
})

export default authRouter;