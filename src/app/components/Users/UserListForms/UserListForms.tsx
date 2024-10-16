'use client'
import { CATEGORIES } from '@/constants/appInfo'
import SubmitButton from '../../Button/SubmitButton'
import { SearchState } from '@/actions/searchAction'

interface UserListFormsProps {
  state: SearchState
  formAction: (formData: FormData) => void
}

const UserListForms = ({ state, formAction }: UserListFormsProps) => {
  return (
    <div className="flex pt-5 ml-5">
      <div>
        <form action={formAction}>
          <div className="flex gap-8 items-center">
            <div>
              <select
                name="sort"
                id="sort"
                className="block py-2 px-2 w-[150px] rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300"
              >
                <option value="created_desc">登録が新しい順</option>
                <option value="created_asc">登録が古い順</option>
              </select>
            </div>
            <div>
              <select
                name="category"
                id="sort"
                className="block py-2 px-2 w-[150px] rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300"
              >
                <option value="">指定なし</option>
                {Object.entries(CATEGORIES).map(([key, cate]) => (
                  <option key={key} value={key}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="isApply"
                id="sort"
                className="block py-2 px-2 w-[150px] rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300"
              >
                <option value="">全て</option>
                <option value="1">承認済み</option>
                <option value="0">未承認</option>
              </select>
            </div>
            <div className="flex items-center">
              <div className="flex-2">
                <input
                  type="text"
                  name="query"
                  defaultValue={state.query}
                  className="py-1.5 px-2 w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300"
                />
              </div>
              <div className="ml-2 flex-1">
                <SubmitButton isSubmitting={false} label="検索" width="100px" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserListForms
