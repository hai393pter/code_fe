import axios from "axios"
import notice from "src/components/Notice"
import STORAGE, { deleteStorage, getStorage } from "src/lib/storage"
import { getMsgClient } from "src/lib/stringsUtils"
import { trimData } from "src/lib/utils"
import ROUTER from "src/router"
/**
 *
 * parse error response
 */
function parseError(messages) {
  // error
  if (messages) {
    if (messages instanceof Array) {
      return Promise.reject({ messages })
    }
    return Promise.reject({ messages: [messages] })
  }
  return Promise.reject({ messages: ["Server quá tải"] })
}

/**
 * parse response
 */

export function parseBody(response) {
  const resData = response.data
  if (+response?.status >= 500) {
    return notice({
      msg: `Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ`,
      isSuccess: false,
    })
  }
  if (+response?.status < 500 && +response?.status !== 200) {
    return notice({
      msg: `Hệ thống xảy ra lỗi. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ (SC${response?.status})`,
      isSuccess: false,
    })
  }

  if (response?.status === 200) {
    if (resData.StatusCode === 401) {
      deleteStorage(STORAGE.TOKEN)
      return window.location.replace(ROUTER.HOME)
    }
    // if (resData.status === -2) return resData // ma sp, ten sp ton tai
    // if (resData.status === 0) return resData // API tra ve success
    if (resData.status !== 200 && resData.Object) {
      notice({ msg: getMsgClient(resData.Object), isSuccess: false })
    }
    // if (resData.status !== 1 && resData.Object) {
    //   return {
    //     ...resData,
    //     object: getMsgClient(resData.Object),
    //   }
    // }
    return resData
  }
  return parseError(resData?.messages)
}

/**
 * axios instance
 */
// const baseURL = ''
const instance = axios.create({
  // baseURL: '',
  timeout: 60000,
})

// request header
instance.interceptors.request.use(
  async config => {
    // Do something before request is sent
    if (config.data) {
      config.data =
        config.data instanceof FormData ? config.data : trimData(config.data)
    }
    config.headers = {
      Authorization: `Bearer ${getStorage(STORAGE.TOKEN)}` || "5W+3CaFlo0GnUltbhGtcgA==",
      // Authorization: getStorage(STORAGE.TOKEN) || "1tjyE+/5HUqKlhwI1IwXwg==",
    }
    config.baseURL = process.env.REACT_APP_API_ROOT
    config.onUploadProgress = progressEvent => {
      // let percentCompleted = Math.floor(
      //   (progressEvent.loaded * 100) / progressEvent.total,
      // )
      // do whatever you like with the percentage complete
      // maybe dispatch an action that will update a progress bar or something
    }
    return config
  },
  error => Promise.reject(error),
)

// response parse
instance.interceptors.response.use(
  response => parseBody(response),
  error => {
    // can not connect API
    if (error.code === "ECONNABORTED") {
      notice({
        msg: "Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ ",
        isSuccess: false,
      })
    } else if (+error?.response?.status >= 500) {
      notice({
        msg: `Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ `,
        isSuccess: false,
      })
    } else if (
      +error?.response?.status < 500 &&
      +error?.response?.status !== 200
    ) {
      notice({
        msg: `Hệ thống xảy ra lỗi. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ (SC${error?.response?.status})`,
        isSuccess: false,
      })
    } else if (error.code === "ERR_NETWORK") {
      notice({
        msg: `Hệ thống đang bị gián đoạn, vui lòng kiểm tra lại đường truyền!`,
        isSuccess: false,
      })
    } else if (typeof error.response === "undefined") {
      notice({ msg: error.response, isSuccess: false })
    } else if (error.response) {
      notice({
        msg: `Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ `,
        isSuccess: false,
      })
      return parseError(error.response.data)
    } else
      notice({
        msg: `Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ `,
        isSuccess: false,
      })
    return Promise.reject(error)
  },
)

export default instance

export const httpGetFile = (path = "", optionalHeader = {}) =>
  instance({
    method: "GET",
    url: path,
    headers: { ...optionalHeader },
  })
