import { useRef } from 'react'
import equal from 'lodash.isequal'

// 在无论是 Pc 还是移动端的业务中，筛选，tab 切换或者其他相关的场景都会遇到竞态的问题
// 竞态简而言之是两个接口在请求的时候，前一个返回的速度比后一个慢导致了后面的数据被覆盖

// 这里将列举一些常见的竞态的列子
/**
 * 1. tab 多 tab 如果公用一个 list 那么在切换 tab 的时候就会导致竞态，这里简单的处理办法是使用多个 list 来存储
 * 2. 筛选，比如表格的筛选，表格中的数据通常是有一个数据源来渲染的，如果带有筛选，也可能会导致竞态，后筛选条件的接口返回比前筛选条件的接口返回快。条件会需要很多
 * 3. 多选也是属于筛选的一种，通常的问题也会导致, 只是多选可能会使用数组来存储比如 [1,2]
 */

/**
 * initialRequest 为可能所有影响接口重新请求的参数
 * @param initialRequest
 */
export function useRace<Request = any>(initialRequest: Request) {
  const requestRef = useRef(initialRequest)

  const isEqual = (compareRequest: Request) => {
    // 判断 request 是否与 requestRef

    return equal(compareRequest, requestRef.current)
  }

  const setRef = (requestOther: Request) => {
    requestRef.current = requestOther
  }

  return { setRef, isEqual }
}
