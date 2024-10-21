import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Grid,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

import { BeatLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { useContextApp } from "../store/useAppContext";
import { Prenotazioni } from "../store/context";

function ModalComp({ isOpen, onClose, card }) {
  const { prenotazioni, addPrenotazione, loading } = useContextApp();
  const [prenotazione, setPrenotazione] = useState<Prenotazioni[]>([]);
  const [prenotazioneNow, setPrenotazioneNow] = useState<Prenotazioni[]>([]);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    Data: "",
    Start_Time: "",
    End_Time: "",
    campo_id: card?.id || "",
  });

  const filterprenotazioni = useCallback(() => {
    const singlePrenotazione = prenotazioni.filter(
      (item) => item.campo_id === card?.id
    );
    const today = new Date().toISOString().split("T")[0];

    const filteredPrenotazioni = singlePrenotazione
      .filter((item) => {
        const itemDate = item.Data;
        return itemDate >= today;
      })
      .sort((a, b) => {
        // Va a filtrare le date da quelle prima alle ultime
        const startA = new Date(`${a.Data}T${a.Start_Time}`);
        const startB = new Date(`${b.Data}T${b.Start_Time}`);
        return startA.getTime() - startB.getTime();
      })
      .map((item) => {
        // Formatta Start_Time and End_Time to HH:mm
        const formatTime = (timeString: string) => {
          const [hours, minutes] = timeString.split(":");
          return `${hours}:${minutes}`; // Format= HH:mm
        };

        return {
          Data: item.Data,
          campo_id: item.campo_id,
          Start_Time: formatTime(item.Start_Time),
          End_Time: formatTime(item.End_Time),
        };
      });

    setPrenotazione(filteredPrenotazioni);
  }, [prenotazioni, card?.id]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const now = prenotazione.filter((item) => item.Data === today);
    setPrenotazioneNow(now);
  }, [prenotazione]);

  useEffect(() => {
    filterprenotazioni();
  }, [prenotazioni, card?.id, filterprenotazioni]);

  // Raggruppare prenotazioni per data
  const groupByDate = (prenotazioni: any[]) => {
    const today = new Date().toISOString().split("T")[0];

    const otherPrenot = prenotazioni.reduce((acc, item) => {
      if (item.Data !== today) {
        //se item.Data non esiste in acc viene creata per avere le prenotazioni su quella data
        if (!acc[item.Data]) {
          acc[item.Data] = [];
        }
        // quando esiste viene fatto il push ('2024-10-09': [])
        acc[item.Data].push(item);
      }
      return acc;
    }, {});

    return otherPrenot;
  };

  const groupedPrenotazioni = groupByDate(prenotazione);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = () => {
    // Funzione per validare il formato HH:00
    const timePattern = /^(?:[01]\d|2[0-3]):00$/;

    const isStartTimeValid = timePattern.test(formData.Start_Time);
    const isEndTimeValid = timePattern.test(formData.End_Time);

    if (!isStartTimeValid || !isEndTimeValid) {
      setMessage("Orario non valido. Usa il formato HH:00.");
      return;
    }

    // validazione per le date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.Data);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setMessage("Non puoi inserire una data del passato.");
      return;
    }

    if (selectedDate.getFullYear() !== today.getFullYear()) {
      setMessage("Puoi prenotare solo per l'anno corrente.");
      return;
    }

    // Crea oggetti Date per la prenotazione
    const formStartDateTime = new Date(
      `${formData.Data}T${formData.Start_Time}`
    );
    const formEndDateTime = new Date(`${formData.Data}T${formData.End_Time}`);

    // Controlla se la prenotazione si sovrappone a quelle esistenti
    const isOverlapping = prenotazione.some((el) => {
      const preStartDateTime = new Date(`${el.Data}T${el.Start_Time}`);
      const preEndDateTime = new Date(`${el.Data}T${el.End_Time}`);

      // Verifica sovrapposizione
      return (
        formStartDateTime < preEndDateTime && formEndDateTime > preStartDateTime
      );
    });

    // Logica di prenotazione
    if (formData.Start_Time && formData.End_Time) {
      if (formData.Start_Time >= formData.End_Time) {
        setMessage(
          "L'orario di partenza non può essere superiore all'orario di fine."
        );
      } else {
        if (isOverlapping) {
          setMessage("Fascia oraria già occupata");
        } else {
          addPrenotazione(formData);
          setMessage("");
        }
      }
    } else {
      setMessage("Inserisci un orario di inizio e/o di fine.");
    }
  };

  const modalSize = useBreakpointValue({ base: "sm", sm: "sm", md: "lg" });
  const inputSize = useBreakpointValue({ base: "160px", md: "200px" });
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Prenota il campo: {card.Name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {/* Layout a due colonne */}
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {/* Accordion lato sinistro */}
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Prenotazioni Oggi
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                {prenotazioneNow.length > 0 ? (
                  prenotazioneNow.map((item, index) => (
                    <AccordionPanel key={index} pb={4}>
                      {item.Start_Time} - {item.End_Time}
                    </AccordionPanel>
                  ))
                ) : (
                  <AccordionPanel>
                    <Box>Non ci sono prenotazioni oggi</Box>
                  </AccordionPanel>
                )}
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Tutte le prenotazioni
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  {/* Object.entries() restituisce un array di coppie chiave-valore dall'oggetto 
                   "2024-10-10": [{ Start_Time: '14:00', End_Time: '15:00' }]*/}
                  {groupedPrenotazioni &&
                  Object.keys(groupedPrenotazioni).length > 0 ? (
                    Object.entries(groupedPrenotazioni)
                      .sort(([dateA], [dateB]) => {
                        // converto in oggeto Date dateA e dateB
                        const timeA = Date.parse(dateA);
                        const timeB = Date.parse(dateB);
                        return timeA - timeB;
                      })
                      .map(([date, items]) => (
                        <Accordion key={date} allowToggle>
                          <AccordionItem>
                            <h2>
                              <AccordionButton>
                                <Box as="span" flex="1" textAlign="left">
                                  {date}
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                              {items.map((item) => (
                                <Box
                                  key={`${item.campo_id}-${item.Start_Time}`}
                                >
                                  {item.Start_Time} - {item.End_Time}
                                </Box>
                              ))}
                            </AccordionPanel>
                          </AccordionItem>
                        </Accordion>
                      ))
                  ) : (
                    <Box>Non ci sono prenotazioni</Box>
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <Box>
              <FormControl>
                <FormLabel>Giorno</FormLabel>
                <Input
                  placeholder="Seleziona il giorno"
                  type="date"
                  onChange={handleChange}
                  value={formData.Data}
                  width={inputSize}
                  name="Data"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Ora di inizio</FormLabel>
                <Input
                  placeholder="Da"
                  type="time"
                  name="Start_Time"
                  onChange={handleChange}
                  value={formData.Start_Time}
                  step="3600"
                  width={inputSize}
                  required
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Ora di fine</FormLabel>
                <Input
                  placeholder="A"
                  type="time"
                  name="End_Time"
                  onChange={handleChange}
                  value={formData.End_Time}
                  step="3600"
                  width={inputSize}
                  required
                />
              </FormControl>
            </Box>
          </Grid>
        </ModalBody>
        <Text h={4}>
          {message && (
            <Text color="red" fontWeight={"bold"} ml={6}>
              {message}
            </Text>
          )}
        </Text>
        <ModalFooter>
          {loading ? (
            <Button
              isLoading
              colorScheme="blue"
              mr={3}
              spinner={<BeatLoader size={8} color="white" />}
            >
              Prenota
            </Button>
          ) : (
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Prenota
            </Button>
          )}
          <Button
            onClick={() => {
              onClose();
              setMessage("");
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalComp;
