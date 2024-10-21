import { useContextApp } from "../store/useAppContext";
import { SimpleGrid, Container } from "@chakra-ui/react";
import CardComp from "./CardComp";

function MainComp() {
  const { campi } = useContextApp();

  return (
    <>
      <Container maxW="container.xl" p={4}>
        <SimpleGrid columns={[1, 2, 2, 3]} spacing="30px">
          {campi.map((item) => (
            <CardComp
            id={item.id}
              key={item.id}
              Name={item.Name}
              isOccupated={item.isOccupated}
            />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}

export default MainComp;
