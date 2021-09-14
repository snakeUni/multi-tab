import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { MultiTab, MultiTabProps } from './Tab'

export default {
  title: 'Example/MultiTab',
  component: MultiTab,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta

const Template: Story<MultiTabProps> = args => <MultiTab {...args} />

export const Tab = Template.bind({})
