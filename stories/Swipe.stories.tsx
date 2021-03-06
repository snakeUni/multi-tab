import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import SwipeDemo from './Swipe'

export default {
  title: 'Example/Swipe',
  component: SwipeDemo,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta

const Template: Story<any> = args => <SwipeDemo {...args} />

export const SwipeDemo1 = Template.bind({})
