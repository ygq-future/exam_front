import http from '@/util/http'
export default{
    getList(data){
        return http({
            url:'/teacher',
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