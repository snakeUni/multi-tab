import { useState, useEffect, useRef } from 'react'
import useEnhancedEffect from './useEnhancedEffect'

/**
 * 数据源类型, 必须要有 key
 */
interface Tab {
  key: string
}

interface UseMultiTab<T extends Tab, DataSource> {
  /**
   * tab 的数据结构
   */
  tabs?: T[]
  defaultCurKey?: string
  defaultDataSource?: DataSource[]
}

interface StateValue<DataSource> {
  /**
   * 数据源
   */
  dataSource?: DataSource[]
  /**
   * 是否已经点击过
   */
  hasClicked?: boolean
  /**
   * page 第几页
   */
  page?: number
}

interface State<DataSource> {
  [key: string]: StateValue<DataSource>
}

interface ScrollRef {
  [key: string]: {
    /**
     * 数据源
     */
    scrollTop?: number
  }
}

interface Status<DataSource> extends StateValue<DataSource> {
  scrollTop?: number
  hidden?: boolean
}

/**
 * 处理移动端多 Tab 滚动条互相影响的场景，主要是基于 Body 的滚动，基于容器的滚动采用多容器即可解决
 * @param param0
 */
export function useMultiTab<T extends Tab, DataSource = any>({
  tabs = [],
  defaultCurKey,
  defaultDataSource = []
}: UseMultiTab<T, DataSource>) {
  const [currentKey, setCurrentKey] = useState(defaultCurKey)
  const currentKeyRef = useRef(currentKey)

  // 保持 key 的同步
  currentKeyRef.current = currentKey

  const [state, setState] = useState<State<DataSource>>(() => {
    return tabs.reduce((acc, cur) => {
      if (cur.key !== defaultCurKey) {
        acc[cur.key] = {
          dataSource: [],
          hasClicked: false,
          page: 1
        }
      } else {
        acc[cur.key] = {
          dataSource: defaultDataSource,
          hasClicked: true,
          page: 1
        }
      }
      return acc
    }, {} as State<DataSource>)
  })
  const scrollTopRef = useRef(
    tabs.reduce((acc, cur) => {
      acc[cur.key] = {
        scrollTop: 0
      }
      return acc
    }, {} as ScrollRef)
  )

  const getDocumentScrollTop = () => {
    if (document?.documentElement) {
      return document.documentElement.scrollTop
    }

    return 0
  }

  const getCurrentKeyScrollTop = (key: string) => {
    return scrollTopRef.current[key].scrollTop
  }

  const setCurrentKeyScrollTop = (key: string, scrollTop: number) => {
    scrollTopRef.current[key].scrollTop = scrollTop
  }

  const setDocumentScrollTop = (scrollTop: number) => {
    if (currentKey) {
      document.documentElement.scrollTop = scrollTop
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (document?.documentElement) {
        const scrollTop = getDocumentScrollTop()
        setCurrentKeyScrollTop(currentKeyRef.current as string, scrollTop)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEnhancedEffect(() => {
    // currentKey 发生改变，则滚动条滚动到对应的位置
    if (currentKey) {
      setDocumentScrollTop(getCurrentKeyScrollTop(currentKey) || 0)
    }
  }, [currentKey])

  const handleChangeTab = (cur: string) => {
    setCurrentKey(cur)
  }

  const dispatchState = (
    outerState: State<DataSource> | ((preState: State<DataSource>) => State<DataSource>)
  ) => {
    let nextState: State<DataSource> = {}
    if (typeof outerState === 'function') {
      nextState = outerState(state)
    } else {
      nextState = outerState
    }
    const newState = Object.keys(nextState).reduce((acc, cur) => {
      acc[cur] = {
        dataSource: nextState[cur].dataSource,
        hasClicked: true
      }
      return acc
    }, {} as State<DataSource>)

    setState({
      ...state,
      ...newState
    })
  }

  /**
   * 适合搜索相关的，重置数据，并且重置分页
   */
  const resetData = (curTabKey: string, stateValue: StateValue<DataSource>) => {
    const nextState: State<DataSource> = {
      ...state,
      [curTabKey]: {
        dataSource: stateValue.dataSource || [],
        page: 1
      }
    }
    dispatchState(nextState)
  }

  /**
   * 加载更多的数据
   * @param curTabKey 当前 tab 的 key
   * @param stateValue 传递最新的数据
   */
  const loadMoreData = (curTabKey: string, stateValue: StateValue<DataSource>) => {
    const preState = state[curTabKey]
    const nextState: State<DataSource> = {
      ...state,
      [curTabKey]: {
        dataSource: preState.dataSource?.concat(stateValue.dataSource || []),
        page: stateValue.page ?? (preState.page || 0) + 1
      }
    }
    dispatchState(nextState)
  }

  const computedStatus = tabs.reduce((acc, cur) => {
    const v = {
      ...state[cur.key],
      scrollTop: scrollTopRef.current[cur.key].scrollTop,
      hidden: currentKey !== cur.key
    }
    acc[cur.key] = v

    return acc
  }, {} as { [key: string]: Status<DataSource> })

  return {
    status: computedStatus,
    dispatch: dispatchState,
    loadMoreData,
    resetData,
    handleChangeTab
  }
}
