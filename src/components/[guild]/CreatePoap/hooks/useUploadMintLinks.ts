import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"
import { useCreatePoapContext } from "../components/CreatePoapContext"
import usePoapLinks from "./usePoapLinks"

type UploadMintLinksData = {
  poapId: number
  links: string[]
}

const fetchData = (data: UploadMintLinksData) =>
  fetcher("/assets/poap/links", { body: data })

const useUploadMintLinks = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { mutateGuild } = useGuild()

  const { poapData } = useCreatePoapContext()
  const { mutate: mutatePoapLinks } = usePoapLinks(poapData?.id)

  return useSubmit<UploadMintLinksData, any>(fetchData, {
    onError: (error) => showErrorToast(error),
    onSuccess: () => {
      toast({
        title: "Successfuly uploaded mint links!",
        status: "success",
      })

      // Mutating the guild data & mint links, so we get back the correct "activated" status for the POAPs
      mutateGuild()
      mutatePoapLinks()
    },
  })
}

export default useUploadMintLinks
