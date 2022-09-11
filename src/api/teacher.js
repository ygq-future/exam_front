import http from '@/util/http'
export default{
    getList(data){
        return http({
            url:'/teacher',
            method:'get',
            data
        })
    },
    lock(teacherId){
        return http({
            method:'patch',
            url:`/teacher/reverseLock/${teacherId}`,
        })
    }
}