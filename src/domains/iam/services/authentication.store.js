import {AuthenticationService} from "./authentication.service.js";
import {defineStore} from "pinia";
import {SignInResponse} from "../model/sign-in.response.js";
import {SignUpResponse} from "../model/sign-up.response.js";

const authenticationService = new AuthenticationService();

/**
 * Store definition for authentication
 * @summary
 * This store is responsible for managing the authentication state.
 * It contains state for signed-in status, user ID, and username.
 * It contains actions to sign-in, sign-up, and sign-out.
 */
export const useAuthenticationStore = defineStore('authentication',{
    state: () => ({ signedIn: false, userId: 0, username: '' }),
    getters: {
        /**
         * Getter to check if user is signed in
         * @param state - Current state of the store
         * @returns {boolean} - True if user is signed in, false otherwise
         */
        isSignedIn: (state) => state['signedIn'],
        /**
         * Getter to get the current user ID
         * @param state - Current state of the store
         * @returns {number} - Current user ID
         */
        currentUserId: (state) => state['userId'],
        /**
         * Getter to get the current username
         * @param state - Current state of the store
         * @returns {string} - Current username
         */
        currentUsername: (state) => state['username'],
        /**
         * Getter to get the current token
         * @returns {string} - Current token
         */
        currentToken: () => localStorage.getItem('token')
    },
    actions: {
        /**
         * Action to sign-in
         * @summary
         * This action calls the sign-in API and updates the store state.
         * If sign-in is successful, it sets the signed-in status, user ID, and username.
         * It also saves the token in local storage.
         * If sign-in fails, it redirects to the sign-in page.
         * @param signInRequest - The {@link SignInRequest} object to sign-in
         * @param router - Vue router instance
         */
        async signIn(signInRequest, router) {
            authenticationService.signIn(signInRequest)
                .then(response => {
                    let signInResponse = new SignInResponse(response.data.id, response.data.username, response.data.token);
                    this.signedIn = true;
                    this.userId = signInResponse.id;
                    this.username = signInResponse.username;
                    localStorage.setItem('token', signInResponse.token);
                    localStorage.setItem('userId', signInResponse.id.toString());
                    console.log(signInResponse);
                    router.push({ name: 'profile' });
                })
                .catch(error => {
                    console.log(error);
                    router.push({ name: 'sign-in' });
                });
        },

        /**
         * Action to sign-up
         * @summary
         * This action calls the sign-up API.
         * If sign-up is successful, it redirects to the sign-in page.
         * If sign-up fails, it redirects to the sign-up page.
         * @param signUpRequest - The {@link SignUpRequest} object to sign-up
         * @param router - Vue router instance
         */
        async signUp(signUpRequest, router) {
            authenticationService.signUp(signUpRequest)
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

        /**
         * Action to sign-out
         * @summary
         * This action signs out the user.
         * It sets the signed-in status to false, user ID to 0, and username to empty string.
         * It also removes the token from local storage and cleans up all related data.
         * It redirects to the sign-in page.
         * @param router - Vue router instance
         */
        async signOut(router) {
            // Clear authentication state
            this.signedIn = false;
            this.userId = 0;
            this.username = '';

            // Clear all localStorage data related to the user session
            this.clearAllUserData();

            console.log('Signed out and localStorage cleaned');
            router.push({ name: 'sign-in' });
        },

        /**
         * Action to clear all user-related data from localStorage
         * @summary
         * This function removes all user-related data from localStorage
         * including authentication tokens, profile data, and tracking data.
         * This ensures that when a user logs out, no previous user data
         * remains that could interfere with a new user session.
         */
        clearAllUserData() {
            // Authentication related data
            localStorage.removeItem('token');
            localStorage.removeItem('userId');

            // Profile related data
            localStorage.removeItem('profileId');

            // Tracking related data
            localStorage.removeItem('trackingId');
            localStorage.removeItem('trackingGoalId');

            // Any other user-specific data can be added here
            // localStorage.removeItem('userPreferences');
            // localStorage.removeItem('userSettings');

            console.log('All user data cleared from localStorage');
        },

        /**
         * Action to validate current session
         * @summary
         * This function checks if the current user session is valid
         * by verifying the token and user data consistency.
         * If the session is invalid, it clears all data and redirects to sign-in.
         * @param router - Vue router instance
         */
        async validateSession(router) {
            const token = localStorage.getItem('token');
            const storedUserId = localStorage.getItem('userId');

            // If no token or userId mismatch, clear session
            if (!token || (storedUserId && parseInt(storedUserId) !== this.userId)) {
                console.warn('Invalid session detected, clearing all data');
                this.clearAllUserData();
                this.signedIn = false;
                this.userId = 0;
                this.username = '';

                if (router) {
                    router.push({ name: 'sign-in' });
                }
                return false;
            }

            return true;
        },

        /**
         * Action to initialize store from localStorage
         * @summary
         * This function restores the authentication state from localStorage
         * when the application starts. It validates the stored data
         * and clears invalid sessions.
         */
        initializeFromStorage() {
            const token = localStorage.getItem('token');
            const storedUserId = localStorage.getItem('userId');

            if (token && storedUserId) {
                const parsedUserId = parseInt(storedUserId, 10);
                if (!isNaN(parsedUserId)) {
                    this.signedIn = true;
                    this.userId = parsedUserId;
                    // Note: username might need to be restored from another source
                    console.log('Session restored from localStorage');
                } else {
                    console.warn('Invalid userId in localStorage, clearing session');
                    this.clearAllUserData();
                }
            }
        }
    }
});