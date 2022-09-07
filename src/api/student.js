import http from '@/util/http'

export default {
    getList(params){
        console.log(params);
        return http({
            method:'get',
            url:'/student',
            params
        })
    }
}