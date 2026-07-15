import {ListItemBuilder} from 'sanity/structure'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Navbar Settings')
    .schemaType('navbarSettings')
    .child(
      S.editor().title('Navbar Settings').schemaType('navbarSettings').documentId('navbarSettings')
    )
)
