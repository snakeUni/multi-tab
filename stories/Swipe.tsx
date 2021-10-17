import * as React from 'react'
import { SwipeAction, List } from 'antd-mobile'

function SwipeDemo() {
  const leftActions = [
    {
      key: 'pin',
      text: '置顶',
      color: 'primary'
    }
  ]
  const rightActions = [
    {
      key: 'unsubscribe',
      text: '取消关注',
      color: 'light'
    },
    {
      key: 'mute',
      text: '免打扰',
      color: 'warning'
    },
    {
      key: 'delete',
      text: '删除',
      color: 'danger'
    }
  ]
  const items = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'L', 'I', 'J', 'K', 'L']
  return (
    <div>
      <div style={{ height: 400, overflow: 'auto' }}>
        <List>
          {items.map(item => (
            <SwipeAction key={item} leftActions={leftActions} rightActions={rightActions}>
              <List.Item>{item}</List.Item>
            </SwipeAction>
          ))}
        </List>
      </div>
    </div>
  )
}

export default SwipeDemo
