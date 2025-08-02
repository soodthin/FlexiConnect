// RadixSelect.js
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

const RadixSelect = ({ value, onValueChange, options, placeholder }) => (
  <Select.Root value={value} onValueChange={onValueChange}>
    <Select.Trigger
      className="inline-flex items-center justify-between rounded-full px-4 py-1 text-sm bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 focus:outline-none"
      aria-label="Job type"
    >
      <Select.Value placeholder={placeholder} />
      <Select.Icon className="ml-2">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content
        side="bottom"
        sideOffset={8}
        className="rounded-md bg-white shadow-lg border border-gray-200 z-50 w-[200px]"
      >
        <Select.ScrollUpButton className="flex items-center justify-center text-gray-400 h-6">
          <ChevronUpIcon />
        </Select.ScrollUpButton>

        <Select.Viewport className="p-1">
          {options.map((opt) => (
            <Select.Item
              key={opt}
              value={opt}
              className="flex items-center px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 cursor-pointer relative"
            >
              <Select.ItemText>{opt}</Select.ItemText>
              <Select.ItemIndicator className="absolute right-3 text-blue-600">
                <CheckIcon />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Viewport>

        <Select.ScrollDownButton className="flex items-center justify-center text-gray-400 h-6">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

export default RadixSelect;
