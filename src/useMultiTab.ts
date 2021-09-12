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

interface State<DataSource> {
  [key: string]: {
    /**
     * 数据源
     */
    dataSource?: DataSource[]
  }
}

interface ScrollRef {
  [key: string]: {
    /**
     * 数据源
     */
    scrollTop?: number
  }
}

/**
 * 处理移动端多 Tab 滚动条互相影响的场景，主要是基于 Body 的滚动，基于容器的滚动采用多容器即可解决
 * @param param0
 */
export default function useMultiTab<T extends Tab, DataSource = any>({
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
          dataSource: []
        }
      } else {
        acc[cur.key] = {
          dataSource: defaultDataSource
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

  const computedStatus = tabs.map(t => {
    return {
      dataSource: state[t.key].dataSource,
      scrollTop: scrollTopRef.current[t.key].scrollTop,
      hidden: currentKey !== t.key
    }
  })

  return []
}
