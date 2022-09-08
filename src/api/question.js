import http from '@/util/http'

export default {
    getList(data){
        return http({
            url:'/question',
            method:'get',
            data
        })
    },
    getType(){
        return http.get('/question-type')
    },
    queryByID:id=>(http({
        url:`/question/${id}`
    }))
}