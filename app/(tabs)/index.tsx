import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Entypo, FontAwesome5, Ionicons,FontAwesome,Octicons,MaterialIcons,FontAwesome6 } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {

  const navigation = useNavigation()
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={["#7e7fD5", "#E9E4F0"]} style={styles.gradient}>
        <View style={styles.header}>
          <AntDesign name="barschart" size={24} color="black" />
          <Text style={styles.title}>Employee Management System</Text>
          <Entypo name="lock-open" size={24} color="black" />
        </View>
        <View style={styles.menuContainer}>
          <Pressable style={styles.press} onPress={()=> navigation.navigate('employees')}>
            
            <View style={styles.sec1}>
              <FontAwesome5 name="users" size={24} color="black" />
            </View>
            <Text style={styles.text_list}>Employee List</Text>
          </Pressable>
          <Pressable style={styles.press}>
            <View style={styles.sec1}>
              <Ionicons name="checkmark-done" size={24} color="black" />
            </View>
            <Text style={styles.text_list}>Mark Attendance</Text>
          </Pressable>
        </View>
        <View style={styles.view_report}>
          <Pressable style={styles.press_attend}>
            <View style={styles.result}>
            <FontAwesome6 name="people-line" size={24} color="black" />
            </View>
            <Text style={styles.text_report}>Attendance Report</Text>
             <View style={styles.arrows}>
             <Entypo name="chevron-right" size={24} color="black" />
             </View>
          </Pressable>
          <Pressable style={styles.press_attend}>
            <View style={styles.result}>
            <Octicons name="repo-pull" size={24} color="black" />
            </View>
            <Text style={styles.text_report}>Summary Report</Text>
             <View style={styles.arrows}>
             <Entypo name="chevron-right" size={24} color="black" />
             </View>
          </Pressable>
          <Pressable style={styles.press_attend}>
            <View style={styles.result}>
            <MaterialIcons name="generating-tokens" size={24} color="black" />
            </View>
            <Text style={styles.text_report}> all Generate Report</Text>
             <View style={styles.arrows}>
             <Entypo name="chevron-right" size={24} color="black" />
             </View>
          </Pressable>
          <Pressable style={styles.press_attend}>
            <View style={styles.result}>
            <FontAwesome6 name="people-group" size={24} color="black" />
            </View>
            <Text style={styles.text_report}>Overtime Employees</Text>
             <View style={styles.arrows}>
             <Entypo name="chevron-right" size={24} color="black" />
             </View>
          </Pressable>
          
        </View>
        <View style={styles.sec3}>
        <View style={styles.attendance_view}>
            <View style={styles.text_move}>
            <MaterialCommunityIcons name="guy-fawkes-mask" size={24} color="black" />
            </View>
            <Text style={styles.text_list}>
              Attendance Criteria
            </Text>
          </View>
          <View style={styles.attendance_view}>
            <View style={styles.text_move}>
            <FontAwesome name="bar-chart-o" size={24} color="black" />
            </View>
            <Text style={styles.text_list}>
              Increased Workflow
            </Text>
          </View>
          </View>
          <View style={styles.sec3}>
        <View style={styles.attendance_view}>
            <View style={styles.text_move}>
            <MaterialCommunityIcons name="guy-fawkes-mask" size={24} color="black" />
            </View>
            <Text style={styles.text_list}>
              Cost of Savings
            </Text>
          </View>
          <View style={styles.attendance_view}>
            <View style={styles.text_move}>
            <FontAwesome name="bar-chart-o" size={24} color="black" />
            </View>
            <Text style={styles.text_list}>
              Employee Perfomance
            </Text>
          </View>
          </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  menuContainer: {
    marginTop: 20,
    flexDirection: 'row', // Align buttons horizontally
    justifyContent: 'space-evenly', // Distribute space evenly between buttons
    alignItems: 'center',
  },
  sec1: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  text_list: {
    marginTop: 7,
    fontWeight: "600",
    fontSize: 16,
    color: "#000",
    textAlign: 'center',
  },
  text_report: {
    flex:1,
    marginLeft: 10,
    fontWeight: "600",
    fontSize: 16,
    color: "#000",
    textAlign: 'center',
  },
  press: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#D3CCE3",
    width: "40%", // Adjust width for better horizontal fit
    marginHorizontal: 10, // Space between buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  result:{
    padding:7,
    width:45,
    borderRadius:10,
    backgroundColor:"white",
    alignItems:"center",
    justifyContent:"center"
  },
  arrows:{
    width:35,
    height:35,
    borderRadius:7,backgroundColor:'white',
    alignItems:"center",
    justifyContent:"center"
  },
  press_attend:{
    marginTop:10,
    backgroundColor:"#BE93C5",
    borderRadius:6,
    padding:10,
    flexDirection:"row",
    alignItems:"center"
  },
  view_report:{
    marginTop:20,
    backgroundColor:"white",
    paddingHorizontal:10,
    paddingVertical:10,
    borderRadius:7
  },
  text_move:{
    width:35,
    height:35,
    borderRadius:7,
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center'
  },
  attendance_view:{
    backgroundColor:'#abcaba',
    marginTop:7,
    borderRadius:7,
    padding:12,
    alignItems:'center',
    justifyContent:'center',
    flex:1
  },
  sec3:{
    flexDirection:'row',
    alignItems:'center',
    gap:12
  }
});
