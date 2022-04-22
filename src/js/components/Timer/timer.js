class Timer {

    constructor(model, audio) {

        this.FULL_DASH_ARRAY = 283;
        this.WARNING_THRESHOLD = 10;
        this.ALERT_THRESHOLD = 5;


        this.COLOR_CODES = {
            info: {
                color: "green"
            },
            warning: {
                color: "orange",
                threshold: this.WARNING_THRESHOLD
            },
            alert: {
                color: "red",
                threshold: this.ALERT_THRESHOLD
            }
        };

        this.restart = false;
        this.TIME_LIMIT = 86;
        this.timePassed = 0;
        this.timeLeft = this.TIME_LIMIT;
        this.timerInterval = null;
        this.remainingPathColor = this.COLOR_CODES.info.color;

        this.paused = false;


    }


    onTimesUp() {
        clearInterval(this.timerInterval);
    }

    startTimer() {
      
        this.timerInterval = setInterval(() => {
            if(this.paused) return;
            this.timePassed = this.timePassed += 1;
            this.timeLeft = this.TIME_LIMIT - this.timePassed;

            this.setCircleDasharray();
            this.setRemainingPathColor(this.timeLeft);

            if (this.timeLeft <= 0) {
                this.onTimesUp();
            }
            document.getElementById("base-timer-label").innerHTML  = this.formatTime(
                this.timeLeft <= 0 ? 0 : this.timeLeft
            );
        }, 1000);
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        if (seconds < 10) {
            seconds = `0${seconds}`;
        }

        return `${minutes}:${seconds}`;
    }

    setRemainingPathColor(timeLeft) {
        const { alert, warning, info } = this.COLOR_CODES;
        if (timeLeft <= alert.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(warning.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(alert.color);
        } else if (timeLeft <= warning.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(info.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(warning.color);
        }
    }

    calculateTimeFraction() {
        const rawTimeFraction = this.timeLeft / this.TIME_LIMIT;
        return rawTimeFraction - (1 / this.TIME_LIMIT) * (1 - this.rawTimeFraction);
    }

    setCircleDasharray() {
        const circleDasharray = `${(
            this.calculateTimeFraction() * this.FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        document
            .getElementById("base-timer-path-remaining")
            .setAttribute("stroke-dasharray", circleDasharray);
    }


}

export default Timer




