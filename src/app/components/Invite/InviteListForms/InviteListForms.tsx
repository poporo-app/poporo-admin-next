'use client'
import SubmitButton from '../../Button/SubmitButton'
import { InviteSearchState } from '@/actions/inviteAction'

interface InviteListFormsProps {
  state: InviteSearchState
  formAction: (formData: FormData) => void
}

const InviteListForms = ({ state, formAction }: InviteListFormsProps) => {
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
            <div className="flex items-center">
              <div className="flex-2">
                <input
                  type="text"
                  name="query"
                  defaultValue={state.query}
                  placeholder="招待コードを入力"
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

export default InviteListForms
