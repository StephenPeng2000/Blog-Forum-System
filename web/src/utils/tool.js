global.tools = {

    /**
     * save user login info
     */
    setLoginUser: function (loginUser) {
        global.SessionStorage.set(global.SessionStorage.SESSION_KEY_LOGIN_USER, loginUser);
    },

    /**
     * get user login info
     */
    getLoginUser: function () {
        return global.SessionStorage.get(global.SessionStorage.SESSION_KEY_LOGIN_USER) || "";
    },

    /**
     * empty verification, null or "" returns true
     */
    isEmpty: function (obj) {
        if ((typeof obj === 'string')) {
            return !obj || obj.replace(/\s+/g, "") === ""
        } else {
            return (!obj || JSON.stringify(obj) === "{}" || obj.length === 0);
        }
    },

    /**
     * non-empty verification
     */
    isNotEmpty: function (obj) {
        return !this.isEmpty(obj);
    }

};
