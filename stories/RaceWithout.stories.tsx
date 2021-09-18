import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import FilterWithoutRace from './FilterWithoutRace'

export default {
  title: 'Example/RaceWithout',
  component: FilterWithoutRace,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta

const Template: Story<any> = args => <FilterWithoutRace {...args} />

export const FilterWithoutRace1 = Template.bind({})
