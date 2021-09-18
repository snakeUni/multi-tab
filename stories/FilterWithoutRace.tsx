import * as React from 'react'
import { Table, Radio } from 'antd'
import { sleep } from 'antd-mobile/es/utils/sleep'
import 'antd/dist/antd.css'

const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' }
]

const columns = [
  { key: 'name', title: '名称', dataIndex: 'name' },
  { key: 'area', title: '地区', dataIndex: 'area' },
  { key: 'size', title: '大小', dataIndex: 'size' }
]

const createDataSource = (length: number, type: string, page: number) => {
  return new Array(length).fill(true).map((_, index) => {
    return {
      name: `${type}-水果-${index}-${page}`,
      area: `${type}-江苏省-${index}-${page}`,
      size: `${type}-大`,
      type
    }
  })
}

export default function Filter() {
  const [radioValue, setRadioValue] = React.useState('Apple')
  const [dataSource, setDataSource] = React.useState([])
  const [page, setPage] = React.useState(1)

  // React.useEffect(() => {
  //   setDataSource(createDataSource(5, radioValue, page))
  // }, [])

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    // setDataSource(createDataSource(5, radioValue, nextPage))
  }

  const handleRadioChange = async (value: string) => {
    setRadioValue(value)
    setPage(1)
    // 构造出竞态
    // if (value === 'Pear') {
    //   await sleep(2000)
    //   setDataSource(createDataSource(5, value, 1))
    // } else {
    //   setDataSource(createDataSource(5, value, 1))
    // }
  }

  React.useEffect(() => {
    // 通过什么 disCancel 来决定是否设置数据，如果依赖变化，当前请求的 didCancel 就会变为 true，那么即使接口返回也不会存在问题
    let didCancel = false
    const fetchData = async () => {
      if (radioValue === 'Pear') {
        await sleep(2000)
      }

      if (!didCancel) {
        setDataSource(createDataSource(5, radioValue, page))
      }
    }

    fetchData()

    return () => {
      didCancel = true
    }
  }, [radioValue, page])

  return (
    <div>
      <Radio.Group
        options={options}
        onChange={e => handleRadioChange(e.target.value)}
        optionType="button"
        value={radioValue}
      />
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current: page,
          onChange: handlePageChange,
          total: 100,
          pageSize: 5
        }}
      />
    </div>
  )
}
