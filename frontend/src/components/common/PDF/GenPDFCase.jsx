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
import fontRegular from "../../../font/Kanit-Regular.ttf";
import caseService from "../../../service/caseService";
import logo from '../../../assets/logo.png'

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
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    logo: {
        width: "60px", // Adjust as needed
        height: "auto",
        marginRight: 10, // Space between logo and text
    },
    headerText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#2d2d2d",
        textAlign: "center",
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

const GenPDFCase = () => {
    const { id } = useParams();
    const [cases, setCases] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await caseService.caseById(id);
                setCases(response.data.data);
                console.log(response.data.data)
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
                    <Image src={logo} style={styles.logo} />
                    <Text style={styles.headerText}>
                        งานจ้างสำรวจหาน้ำสุญเสียงเชิงรุก (ALC)
                    </Text>
                </View>

                {cases ? (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.text}>
                                วันที่: {new Date(cases.date).toLocaleDateString()}
                            </Text>
                            <Text style={styles.text}>
                                พื้นที่ DMA {cases.dma} บ้านเลขที่ {cases.houseNumber}{" "}
                                หมู่ {cases.villageNo} ตำบล {cases.subdistrict} อำเภอ{" "}
                                {cases.district} จังหวัด {cases.province}
                            </Text>
                            <Text style={styles.text}>
                                เจ้าหน้าที่รับเรื่อง: {cases.inspector?.title}{cases.inspector?.firstName} {cases.inspector?.lastName}
                            </Text>
                        </View>
                        <View style={styles.imageContainer}>
                            {cases.images && cases.images.length > 0 ? (
                                cases.images.map((image, index) => (
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

export default GenPDFCase;
