import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  AvatarBadge,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import useUser from "components/[guild]/hooks/useUser"
import useToast from "hooks/useToast"
import { LinkBreak } from "phosphor-react"
import platforms from "platforms"
import { useRef } from "react"
import { PlatformName } from "types"
import useDisconnect from "../hooks/useDisconnect"

type Props = {
  name: string
  image?: string
  type: PlatformName
}

const LinkedSocialAccount = ({ name, image, type }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { mutate } = useUser()
  const onSuccess = () => {
    if (type === "DISCORD") {
      const keysToRemove = Object.keys({ ...window.localStorage }).filter((key) =>
        /^dc_auth_[a-z]*$/.test(key)
      )

      keysToRemove.forEach((key) => {
        window.localStorage.removeItem(key)
      })
    }

    toast({
      title: `Account removed!`,
      status: "success",
    })
    mutate()
    onClose()
  }
  const { onSubmit, isLoading, signLoadingText } = useDisconnect(onSuccess)
  const alertCancelRef = useRef()

  const circleBorderColor = useColorModeValue("gray.100", "gray.800")

  const disconnectAccount = () => onSubmit({ platformName: type })

  return (
    <>
      <HStack spacing={4} alignItems="center" w="full">
        <Avatar src={image} size="sm">
          <AvatarBadge
            boxSize={5}
            bgColor={`${platforms[type]?.colorScheme}.500`}
            borderWidth={1}
            borderColor={circleBorderColor}
          >
            <Icon as={platforms[type]?.icon} boxSize={3} color="white" />
          </AvatarBadge>
        </Avatar>
        <Text fontWeight="semibold">{name}</Text>
        <Tooltip label="Disconnect account" placement="top" hasArrow>
          <IconButton
            rounded="full"
            variant="ghost"
            size="sm"
            icon={<Icon as={LinkBreak} />}
            colorScheme="red"
            ml="auto !important"
            onClick={onOpen}
            aria-label="Disconnect account"
          />
        </Tooltip>
      </HStack>

      <Alert {...{ isOpen, onClose }} leastDestructiveRef={alertCancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{`Disconnect ${platforms[type]?.name} account`}</AlertDialogHeader>

            <AlertDialogBody>
              {`Are you sure? This account will lose every Guild gated access on ${platforms[type]?.name}.`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={alertCancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={disconnectAccount}
                isLoading={isLoading}
                loadingText={signLoadingText || "Removing"}
                ml={3}
              >
                Disconnect
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </Alert>
    </>
  )
}

export default LinkedSocialAccount
