import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
  Image,
} from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import stepTesstService from "../../../service/stepTestService";
import fontRegular from "../../../font/Kanit-Regular.ttf";

// Registering the custom font
Font.register({
  family: "Kanit",
  fonts: [{ src: fontRegular, fontWeight: "normal" }],
});

const styles = StyleSheet.create({
  page: {
    padding: "40px",
    fontFamily: "Kanit",
    backgroundColor: "#f4f4f4",
  },
  header: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#2d2d2d",
  },
  section: {
    fontSize: 16,
    marginBottom: 20,
  },
  text: {
    marginBottom: 10,
    lineHeight: 1.6,
    color: "#333",
  },
  sectionDetail: {
    fontSize: 18,
    marginTop: 20,
    borderBottom: "2px solid #333",
    paddingBottom: 10,
  },
  roundContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  roundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  roundText: {
    fontSize: 16,
    marginRight: 10,
    color: "#555",
  },
  listItem: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 15,
  },
  image: {
    width: 150,
    height: 150,
    margin: 5,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  loaderText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 30,
    color: "#777",
  },
});

const GenPDF = () => {
  const { id } = useParams();
  const [stepTest, setStepTest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await stepTesstService.stepTestById(id);
        setStepTest(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const PDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>รายงานการทดสอบ</Text>
        </View>

        {stepTest ? (
          <>
            <View style={styles.section}>
              <Text style={styles.text}>
                วันที่: {new Date(stepTest.date).toLocaleDateString()}
              </Text>
              <Text style={styles.text}>
                พื้นที่ DMA {stepTest.dma} บ้านเลขที่ {stepTest.houseNumber}{" "}
                หมู่ {stepTest.villageNo} ตำบล {stepTest.subdistrict} อำเภอ{" "}
                {stepTest.district} จังหวัด {stepTest.province}
              </Text>
            </View>

            <View style={styles.sectionDetail}>
              <Text style={styles.text}>รายละเอียดการทดสอบ (Step Test)</Text>
              <View style={styles.roundContainer}>
                {stepTest.rounds && stepTest.rounds.length > 0 ? (
                  stepTest.rounds.map((round, index) => (
                    <View key={index} style={styles.roundItem}>
                      <Text style={styles.roundText}>รอบที่: {round.roundNo}</Text>
                      <Text style={styles.roundText}>ค่าที่ทดสอบ: {round.stepTest}</Text>
                      <Text style={styles.roundText}>ผลการทดสอบ: {round.value}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.listItem}>ไม่พบข้อมูลการทดสอบ</Text>
                )}
              </View>
            </View>

            <View style={styles.imageContainer}>
              {stepTest.images && stepTest.images.length > 0 ? (
                stepTest.images.map((image, index) => (
                  <Image
                    key={index}
                    style={styles.image}
                    src={`http://localhost:8080${image}`}
                    alt={`Step Test ${index + 1}`}
                  />
                ))
              ) : (
                <Text style={styles.loaderText}>ไม่มีภาพ</Text>
              )}
            </View>
          </>
        ) : (
          <View style={styles.section}>
            <Text style={styles.loaderText}>กำลังโหลดข้อมูล...</Text>
          </View>
        )}
      </Page>
    </Document>
  );

  return (
    <div style={{ width: "100%", height: "100vh", margin: 0, padding: 0 }}>
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <PDF />
      </PDFViewer>
    </div>
  );
};

export default GenPDF;
