export default class View{
    #btnInit = document.querySelector('#init')
    #statusElement = document.querySelector('#status')
    #videoFrameCavas = document.createElement('canvas')
    #canvasContext = this.#videoFrameCavas.getContext('2d',{willReadFrequently: true})
    #videoElement = document.querySelector('#video')

    getVideoFrame(video){
        const canvas = this.#videoFrameCavas
        const [width, height] = [video.videoWidth, video.videoHeight]
        canvas.width = width
        canvas.height = height

        this.#canvasContext.drawImage(video, 0, 0, width, height)
        return this.#canvasContext.getImageData(0, 0, width, height)
    }


    togglePlayVideo(){
        if(this.#videoElement.paused){
            this.#videoElement.play()
            return;
        }
        this.#videoElement.pause()
    }

    enableButton(){
        this.#btnInit.disabled = false;
    }

    configureOnBtnClick(fn){
        this.#btnInit.addEventListener('click', fn)
    }

    log(text){
        this.#statusElement.innerHTML = text;
    }
} 