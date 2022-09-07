import http from '@/util/http'

export default {
  majorList() {
    return http({
      method:'get',
      url:'/major',
    });
  },
  addMajor(name) {
    return http({
      method:'post',
      url:'/major',
      data:{name}
    });
  },
  addClass(data){
    return http({
      method:'post',
      url:'/clazz',
      data
    });
  },
  delMajor(id){
    return http({
      method:'delete',
      url:`/major/${id}`,
    })
  },
  delClass(id){
    return http({
      method:'delete',
      url:`/clazz/${id}`
    })
  },
  editClass(id,data){
    return http({
      method:'patch',
      url:`/clazz/${id}`,
      data
    })
  },
  editMajor(id,data){
    return http({
      method:'put',
      url:`/major/${id}`,
      data
    })
  }
};
