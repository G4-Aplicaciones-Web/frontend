import { AuthenticationService } from "./authentication.service.js";
import { defineStore } from "pinia";
import { SignInResponse } from "../model/sign-in.response.js";
import { SignUpResponse } from "../model/sign-up.response.js";

const authenticationService = new AuthenticationService();

/**
 * Store definition for authentication
 * @summary
 * Este store gestiona el estado de autenticación y persiste usuario e id en localStorage.
 */
export const useAuthenticationStore = defineStore('authentication', {
    state: () => ({
        signedIn: !!localStorage.getItem('token'),
        userId: Number(localStorage.getItem('userId')) || 0,
        username: localStorage.getItem('username') || ''
    }),
    getters: {
        isSignedIn: (state) => state['signedIn'],
        currentUserId: (state) => state['userId'],
        currentUsername: (state) => state['username'],
        currentToken: () => localStorage.getItem('token')
    },
    actions: {
        async signIn(signInRequest, router) {
            authenticationService.signIn(signInRequest)
                .then(response => {
                    let signInResponse = new SignInResponse(response.data.id, response.data.username, response.data.token);
                    this.signedIn = true;
                    this.userId = signInResponse.id;
                    this.username = signInResponse.username;
                    localStorage.setItem('token', signInResponse.token);
                    localStorage.setItem('userId', signInResponse.id);
                    localStorage.setItem('username', signInResponse.username);
                    console.log(signInResponse);
                    router.push({ name: 'home' });
                })
                .catch(error => {
                    console.log(error);
                    router.push({ name: 'sign-in' });
                });
        },
        async signUp(signUpdRequest, router) {
            authenticationService.signUp(signUpdRequest)
                .then(response => {
                    let signUpResponse = new SignUpResponse(response.data.message);
                    router.push({ name: 'sign-in' });
                    console.log(signUpResponse);
                })
                .catch(error => {
                    console.log(error);
                    router.push({ name: 'sign-up' });
                });
        },
        async signOut(router) {
            this.signedIn = false;
            this.userId = 0;
            this.username = '';
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            console.log('Signed out');
            router.push({ name: 'sign-in' });
        }
    }
});
