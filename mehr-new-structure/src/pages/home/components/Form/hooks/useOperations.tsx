import { usePostQuery } from "./queries/usePostQuery"
import { useGetQuery } from "./queries/useGetQuery"
import { useEditQuery } from "./queries/useEditQuery"

export const useOperations = () => {
    const {data: getData} = useGetQuery()
    const {data: postData} = usePostQuery()
    const {data: editData} = useEditQuery()

    return {getData, postData, editData}
}