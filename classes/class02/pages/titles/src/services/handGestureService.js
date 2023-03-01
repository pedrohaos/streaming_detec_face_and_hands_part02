import { knownGestures, gestureStrings } from "../util/gestures.js"


//aqui é a onde esta a macheLanr já pre-treinada
export default class HandGestureService{
    #gestureEstimator
    #handPoseDetection
    #handsVersion
    #detector = null

    constructor({fingerpose,handPoseDetection,handsVersion}){
        this.#gestureEstimator = new fingerpose.GestureEstimator(knownGestures)
        this.#handPoseDetection = handPoseDetection
        this.#handsVersion = handsVersion
    }

    async estimate(keypoints3D){
        const predictions = await this.#gestureEstimator.estimate(
            //porcentagem de confiança (90%)
            this.#getLandMarksFromKeypoints(keypoints3D),9
        )
        return predictions.gestures;
    }

    async * detectGestures(predictions){
        for(const hand of predictions){
            if(!hand.keypoints3D)continue

            const gestures = await this.estimate(hand.keypoints3D)
            if(!gestures.length) continue

            //quando passar na primeira interação ao encontrar o item
            const result = gestures.reduce(
                (previous, current) => (previous.score > current.score) ? previous : current
            )
            const {x,y} = hand.keypoint.find(keypoint => keypoint.name === 'index_finger_tip')
            //aqui ele já retorna para quem chamou depois ele faz o proximo for
            yield { event: result.name, x, y}
            //assim ganhando velocidade e performace  
            
            console.log('detected', gestureStrings[result.name])
        }
    }

    #getLandMarksFromKeypoints(keypoints3D){
        return keypoints3D.map(keypoint =>
            [keypoint.x, keypoint.y, keypoint.z]
        )
    }

    async estimateHands(video){
        return this.#detector.estimateHands(video, {
            //a camera fica espelhada, então esse codigo 
            //serve para invertela
            flipHorizontal: true 
            //(se a mão for para a direita no video ela tambem ira para a direita)
        })
    }

    async initializeDetector(){
        //se o #detector possuir algum dado ele já retorna "if(true)"
        if(this.#detector) return this.#detector

        //se não, o valor dele será dado
        const detectorConfig = {
            runtime: 'madiapipe', //or 'tfjs
            // a versão da biblioteca das mãos foi fixada para continuar funcionando
            //caso o Google a altere futuramete, para não danificar o funciomento mãos 
            solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${this.#handsVersion}`,
            // O modalType: 'full' é mais preciso porém mais pesado
            modalType: 'lite',
            maxHands: 2,
        }
        const detector = await this.#handPoseDetection.createDetector(
            this.#handPoseDetection.SupportedModels.MediaPipeHands,
            detectorConfig
        )

        return this.#detector
    }
}
