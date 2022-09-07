import http from "@/util/http";

export default {
  getList(params) {
    return http({
      method: "get",
      url: "/student",
      params,
    });
  },
  lock(studentId) {
    return http({
        method:'patch',
        url:`/student/reverseLock/${studentId}`
    });
  },
};
