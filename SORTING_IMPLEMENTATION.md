# Sorting Implementation Documentation

## Overview
This implementation adds comprehensive sorting functionality for ministries and parishes throughout the Find My Ministry application. Users can now sort lists by name (A-Z or Z-A) and ministries can also be sorted by type.

## Components Updated

### 1. ListView Component (`/client/src/pages/ListView.tsx`)
- **Added**: Sorting controls above the ministry grid
- **Features**: 
  - Sort by name (A-Z, Z-A)
  - Sort by ministry type (A-Z, Z-A) 
  - Sort state is maintained during filtering
  - Real-time updates when sorting option changes

### 2. ParishList Component (`/client/src/pages/ParishList.tsx`)
- **Added**: Sorting controls above the parish grid
- **Features**:
  - Sort by name (A-Z, Z-A)
  - Sort state is maintained during search filtering
  - Consistent UI with other listing pages

### 3. SearchResults Component (`/client/src/pages/SearchResults.tsx`)
- **Added**: Separate sorting controls for both parish and ministry sections
- **Features**:
  - Independent sorting for parishes and ministries
  - Sort options appropriate to each content type
  - Clear visual separation between sections

### 4. MeetingTimesSearch Component (`/client/src/pages/MeetingTimesSearch.tsx`)
- **Added**: Sorting controls for filtered meeting results
- **Features**:
  - Sort filtered ministry results
  - Maintains sort order across filter changes
  - Full ministry sorting options available

## New Components Created

### 1. SortDropdown Component (`/client/src/components/common/SortDropdown.tsx`)
- **Purpose**: Reusable dropdown for selecting sort options
- **Features**:
  - Accessible select element with icon
  - Customizable options list
  - Consistent styling across the application

### 2. SortControls Component (`/client/src/components/common/SortDropdown.tsx`)
- **Purpose**: Complete sort interface with result count
- **Features**:
  - Combines result count display with sort dropdown
  - Responsive design (hides "Sort by:" label on mobile)
  - Configurable for different content types

## New Hooks

### useSort Hook (`/client/src/hooks/useSort.ts`)
- **Purpose**: Manage sorting state and provide sort configuration
- **Features**:
  - Configurable default sort option
  - Parses sort strings into structured config
  - Provides update function for sort changes

## Utility Functions

### Sorting Utilities (`/client/src/utils/ministryUtils.ts`)

#### `sortMinistries(ministries: Ministry[], sortConfig: SortConfig): Ministry[]`
- Sorts ministry arrays by name or type
- Uses `localeCompare` for proper alphabetical sorting
- Supports both ascending and descending order
- Returns new array (does not mutate original)

#### `sortParishes(parishes: Parish[], sortConfig: SortConfig): Parish[]`
- Sorts parish arrays by name or city
- Uses `localeCompare` for proper alphabetical sorting
- Supports both ascending and descending order
- Returns new array (does not mutate original)

#### `parseSortOption(sortOption: SortOption): SortConfig`
- Converts string sort options to structured configuration
- Supports formats like "name-asc", "type-desc", etc.

#### `getSortOptionLabel(sortOption: SortOption): string`
- Provides user-friendly labels for sort options
- Maps technical values to display text

## Sort Options Available

### Ministry Sorting
- **Name (A-Z)**: `name-asc`
- **Name (Z-A)**: `name-desc`
- **Type (A-Z)**: `type-asc` 
- **Type (Z-A)**: `type-desc`

### Parish Sorting
- **Name (A-Z)**: `name-asc`
- **Name (Z-A)**: `name-desc`

## Implementation Details

### Performance Considerations
- Uses React.useMemo to prevent unnecessary re-sorting
- Sorting only recalculates when data or sort configuration changes
- Efficient `localeCompare` for string comparison

### Accessibility
- Proper semantic select elements
- Screen reader friendly labels
- Keyboard navigation support

### UX Design
- Consistent placement of sort controls across all pages
- Clear visual hierarchy with result counts
- Responsive design for mobile devices
- Sort state persists during filtering/searching

## Testing
- Comprehensive unit tests in `/client/src/utils/__tests__/ministryUtils.test.ts`
- Tests cover all sorting functions and edge cases
- Validates immutability of sorting operations
- Tests multiple sort directions and field types

## Usage Example

```typescript
import { useSort } from '../hooks';
import { SortControls } from '../components/common';
import { sortMinistries } from '../utils';

const MyComponent = () => {
    const { sortOption, sortConfig, updateSort } = useSort();
    const [ministries, setMinistries] = useState([]);
    
    const sortedMinistries = useMemo(() => {
        return sortMinistries(ministries, sortConfig);
    }, [ministries, sortConfig]);

    return (
        <div>
            <SortControls
                sortOption={sortOption}
                onSortChange={updateSort}
                availableOptions={['name-asc', 'name-desc', 'type-asc', 'type-desc']}
                resultCount={sortedMinistries.length}
                itemType="ministries"
            />
            {/* Render sorted ministries */}
        </div>
    );
};
```

## Future Enhancements

Potential additions for future development:
1. **Additional Sort Fields**: Sort by creation date, participant count, etc.
2. **Multi-field Sorting**: Primary and secondary sort criteria
3. **Saved Sort Preferences**: Remember user's preferred sort options
4. **Advanced Sort UI**: Table-style headers with clickable column sorting
5. **Custom Sort Orders**: User-defined priority for ministry types