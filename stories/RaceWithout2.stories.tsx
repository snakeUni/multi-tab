import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import FilterWithoutRace2 from './FilterWithoutRace2'

export default {
  title: 'Example/RaceWithout2',
  component: FilterWithoutRace2,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta

const Template: Story<any> = args => <FilterWithoutRace2 {...args} />

export const FilterWithoutRace4 = Template.bind({})
