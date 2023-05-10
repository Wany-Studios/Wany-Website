const showErrorToForm = (() => {
    const element = document.querySelector`#form-error`;

    let abortController = null;

    return function (message, timeout) {
        abortController && abortController.abort();

        let canExecuteAction = true;
        let finished = false;

        element.innerHTML = !message ? "" : `<span>&#9888;</span> ${message.replaceAll('"', '')}`;
        abortController = new AbortController();

        const signal = abortController.signal;

        signal.onabort = function () {
            abortController = null;
            canExecuteAction = false;
        }

        if (timeout) {
            const promise = new Promise(resolve => setTimeout(resolve, timeout));

            promise.then(function () {
                if (canExecuteAction) element.innerHTML = "";
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
            }
        };
    }
})();
