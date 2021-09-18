import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import Filter from './Filter'

export default {
  title: 'Example/Race',
  component: Filter,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta

const Template: Story<any> = args => <Filter {...args} />

export const FilterRace = Template.bind({})
