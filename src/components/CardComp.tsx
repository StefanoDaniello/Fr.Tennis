import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Button,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import ModalComp from "./ModalComp";
import { motion } from "framer-motion";

interface Campo {
    id:number;
  key: number;
  Name: string;
  isOccupated: boolean;
}
const MotionCard = motion(Card);

function CardComp(itemCard: Campo) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <MotionCard
        maxW="sm"
        onClick={onOpen}
        whileHover={{ scale: 1.05 }} 
        transition={{ duration: 0.2 }}
      >
        <CardBody>
          <Image
            src="https://images.unsplash.com/photo-1590075726045-e1e0500c8e9d?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Green double couch with wooden legs"
            borderRadius="lg"
            boxSize="350px"
            objectFit="cover"
          />
          <Stack mt="6" spacing="3">
            <Heading size="md">{itemCard.Name}</Heading>
          </Stack>
        </CardBody>
        <CardFooter justifyContent="center" display="flex">
          <Button
            variant="solid"
            colorScheme="blue"
            onClick={onOpen}
            px={10}
            py={7}
          >
            Prenota
          </Button>
        </CardFooter>
      </MotionCard>

      {/* Modale che si apre quando si clicca "Prenota" */}
      <ModalComp isOpen={isOpen} onClose={onClose} card={itemCard} />
    </>
  );
}

export default CardComp;
