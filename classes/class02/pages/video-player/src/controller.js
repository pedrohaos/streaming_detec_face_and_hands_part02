export default class Controller {
    #view
    #camera
    #worker
    #blinkedCouter = 0
    constructor({ view, camera, worker }){
        this.#view = view
        this.#camera = camera
        this.#worker = this.#configuraWorker(worker)

        this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
    }
    static async initialize(deps) {
        const controller = new Controller(deps)
        controller.log('Ainda não detectei sua piscada de olhos! click no botão para começar')
        return controller.init()
    }
    #configuraWorker(worker){
        worker.onmessage = (msg) =>{
            if('READY' === msg.data){
                console.log('worker is ready!!!')
                this.#view.enableButton()
                ready = true;
                return;
            }

            const blinked = data.blinked
            this.#blinkedCouter += blinked
            this.#view.togglePlayVideo()
            console.log('blinked', blinked)
        }

        return {
            send (msg){
                if(!ready) return;
                worker.postMenssage(msg)
            }
        }
    }

    async init() {
        console.log('init!!!')
    }

    loop(){
        const video = this.#camera.video
        const img = this.#view.getVideoFrame(video)
        this.#worker.send(img)
        this.log(`detectei uma piscada de olhos...`)

        setTimeout(()=>this.loop(), 100);
    }

    log(text){
        const times = `        -blinked times: ${this.#blinkedCouter}`
        this.#view.log(`status: ${text}`.concat(this.#blinkedCouter ? times : ""))
    }

    onBtnStart(){
        this.log('iniciando a detecção....')
        this.#blinkedCouter = 0
        this.loop();
    }
}