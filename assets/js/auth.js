document.querySelector('#form-container').onmousemove = (e) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];

    target.style.setProperty('--mouse-x', `${x}px`);
    target.style.setProperty('--mouse-y', `${y}px`);
};

const showErrorToForm = (() => {
    const element = document.querySelector`#form-error`;

    let abortController = null;

    return function (message, timeout) {
        if (message instanceof Array) {
            message = message[0];
        }

        abortController && abortController.abort();

        let canExecuteAction = true;
        let finished = false;

        element.innerHTML = !message
            ? ''
            : `<span>&#9888;</span> ${message.replaceAll('"', '')}`;
        abortController = new AbortController();

        const signal = abortController.signal;

        signal.onabort = function () {
            abortController = null;
            canExecuteAction = false;
        };

        if (timeout) {
            const promise = new Promise((resolve) => setTimeout(resolve, timeout));

            promise.then(function () {
                if (canExecuteAction) element.innerHTML = '';
                abortController = null;
                finished = true;
            });
        }

        return {
            abort: function () {
                const aborted = signal.aborted;
                !aborted && abortController.abort();
            },
            get aborted() {
                return signal.aborted;
            },
            get finished() {
                return signal.aborted || finished;
            },
        };
    };
})();

channelListenForMessage(CHANNEL_EVENTS.USER_DATA_UPDATED, (data) => {
    window.location.href = resolveUrl() + 'home/';
});

function signIn(data) {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes();

        axios
            .post(routes.login_url, data, DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}
