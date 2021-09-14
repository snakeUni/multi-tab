import * as React from 'react'
import { useMultiTab } from '../src'
import { Tabs, InfiniteScroll } from 'antd-mobile'
import { sleep } from 'antd-mobile/es/utils/sleep'
import { Affix } from 'antd'
import './tab.css'

const tabs = [
  {
    title: '食品',
    key: 'food'
  },
  {
    title: '男装',
    key: 'maleClothing'
  },
  {
    title: '水果',
    key: 'fruits'
  },
  {
    title: '百货',
    key: 'department'
  },
  {
    title: '内衣',
    key: 'underwear'
  },
  {
    title: '女装',
    key: 'femaleClothing'
  },
  {
    title: '电器',
    key: 'appliances'
  },
  {
    title: '鞋包',
    key: 'shoeBag'
  },
  {
    title: '手机',
    key: 'phone'
  },
  {
    title: '母婴',
    key: 'maternal'
  }
]

const createDataSource = (length: number, type: string) => {
  return new Array(length).fill(true).map((_, index) => {
    return {
      title: `${type}-网红嗨吃家酸辣粉方便面整箱批发红薯粉大桶装泡面螺蛳粉零食小吃-${index}`,
      imgUrl:
        'https://img.pddpic.com/goods/images/2021-04-22/6bc9b1ce78d23e6b2fda9b42c42481e7.jpeg',
      desc: '退货包运费',
      type: type
    }
  })
}

export interface MultiTabProps {}

async function mockRequest(key: string) {
  await sleep(2000)
  return createDataSource(10, key)
}

export function MultiTab() {
  const { handleChangeTab, currentKey, status, loadMoreData, initTabState } = useMultiTab({
    defaultCurKey: 'food',
    tabs,
    defaultDataSource: createDataSource(10, 'food')
  })

  const handleLoadMore = async () => {
    const data = await mockRequest(currentKey)
    loadMoreData(currentKey, { dataSource: data })
  }

  const handleTabChange = async (tab: string) => {
    handleChangeTab(tab)
    const data = await mockRequest(tab)
    if (!status[tab].hasClicked) {
      initTabState(tab, { dataSource: data })
    }
  }

  return (
    <div>
      <Affix offsetTop={0}>
        <Tabs onChange={handleTabChange}>
          {tabs.map(t => {
            return <Tabs.TabPane title={t.title} key={t.key} />
          })}
        </Tabs>
      </Affix>
      <div>
        {tabs.map(t => {
          const cur = status[t.key]
          const { dataSource, hidden, hasClicked } = cur
          // 已经点击过 tab
          console.log('hasClicked:', hasClicked)
          if (hasClicked) {
            return (
              <div hidden={hidden} key={t.key}>
                {dataSource.map((d, index) => (
                  <Card {...d} key={index} />
                ))}
              </div>
            )
          } else {
            return null
          }
        })}
      </div>
      <InfiniteScroll hasMore={true} loadMore={handleLoadMore} />
    </div>
  )
}

interface CardProps {
  imgUrl?: string
  title?: string
  desc?: string
  type?: string
}

function Card({ imgUrl, title, desc }: CardProps) {
  return (
    <div className="card">
      <img src={imgUrl} width={156} height={156} />
      <div className="card-content">
        <div className="card-title">{title}</div>
        <div className="card-desc">{desc}</div>
      </div>
    </div>
  )
}
