using System.Collections;
using System.IO;
using UnityEngine;
using UnityEngine.UI;

public class Logger : MonoBehaviour
{
    public string name;
    public float logInterval = 1f;
    bool isRunning = false;
    float elapsedTime;
    string taskStatus;
    GameObject[] trackers = new GameObject[3];
    GameObject headset;
    GameObject leftController;
    GameObject rightController;
    GameObject sliver;
    GameObject target;
    float distance;

    private void Start()
    {

        trackers[0] = GameObject.Find("Camera");
        trackers[1] = GameObject.Find("Controller (left)");
        trackers[2] = GameObject.Find("Controller (right)");
        sliver = GameObject.Find("Sliver");
        target = GameObject.Find("Target");
        SetupCSV();
    }

    void Update()
    {
        elapsedTime += Time.deltaTime;
        taskStatus = GameObject.Find("TaskStatusText").GetComponent<Text>().text;
        distance = Vector3.Distance(sliver.transform.position, target.transform.position);
        //positions[0] = 
        Debug.Log("headset at: " + trackers[0].transform.position);
        Debug.Log("distance: " + distance);

        if (!isRunning) StartCoroutine("LogMessage");
    }

    IEnumerator LogMessage()
    {
        AddRecord(GetPath());
        isRunning = true;
        yield return new WaitForSeconds(logInterval);
        isRunning = false;
    }

    void SetupCSV()
    {
        using (StreamWriter file = new StreamWriter(GetPath(), true))
        {
            file.WriteLine(
                "name" + "," 
                + "elapsedTime" + "," 
                + "taskStatus" + ","
                + "headset x" + "," 
                + "headset y" + "," 
                + "headset z" + ","
                + "Controller (left) x" + "," 
                + "Controller (left) y" + "," + "Controller (left) z" + ","
                + "Controller (right) x" + "," + "Controller (right) y" + "," + "Controller (left) z" + ","
                + "distance");
        }
    }

    void AddRecord(string filepath)
    {
        using (StreamWriter file = new StreamWriter(filepath, true))
        {
            file.WriteLine(name + "," + elapsedTime + "," + taskStatus + "," 
                + trackers[0].transform.position.x + "," + trackers[0].transform.position.y + "," + trackers[0].transform.position.z + ","
                + trackers[1].transform.position.x + "," + trackers[1].transform.position.y + "," + trackers[1].transform.position.z + ","
                + trackers[2].transform.position.x + "," + trackers[2].transform.position.y + "," + trackers[2].transform.position.z + ","
                + distance);
        }
    }

    private string GetPath()
    {
#if UNITY_EDITOR
        return Application.dataPath + "/Data/CNSData.csv";
#elif UNITY_ANDROID
        return Application.persistentDataPath+"Saved_data.csv";
#elif UNITY_IPHONE
        return Application.persistentDataPath+"/"+"Saved_data.csv";
#else
        return Application.dataPath +"/"+"Saved_data.csv";
#endif
    }
    //    public float logInterval;
    //    public string logMessage;
    //    bool isRunning;

    //    float msgCounter = 0;

    //    private List<string[]> rowData = new List<string[]>();
    //    public string[] rowDataTemp = new string[4];



    //    // Start is called before the first frame update
    //    void Start()
    //    {

    //        isRunning = false;
    //        logInterval = 5f;
    //        SetUpCSV();
    //        if (!isRunning) StartCoroutine("LogMessage");
    //    }

    //    void SetUpCSV()
    //    {
    //        //Empty file before logging
    //        File.WriteAllText(getPath(), "");

    //        //Set up headers
    //        rowDataTemp[0] = "MsgNumber";
    //        rowDataTemp[1] = "Date+Time";
    //        rowDataTemp[2] = "Active for seconds";
    //        rowDataTemp[3] = "value of elapsedTimeSinceCameraMovement" + "\n";
    //        rowData.Add(rowDataTemp);
    //        WriteToFile();
    //    }

    //    void Update()
    //    {
    //        if (!isRunning) StartCoroutine("LogMessage");

    //    }

    //    IEnumerator LogMessage()
    //    {
    //        rowDataTemp[0] = msgCounter.ToString();
    //        rowDataTemp[1] = DateTime.Now.ToString("dddd - dd MMMM yyyy HH:mm:ss");
    //        rowDataTemp[2] = Time.time.ToString();

    //        rowData.Add(rowDataTemp);
    //        WriteToFile();
    //        //append last entry and write to file

    //        //Debug.Log("message #" + msgCounter);
    //        isRunning = true;
    //        //Debug.Log(logMessage);
    //        yield return new WaitForSeconds(logInterval);
    //        isRunning = false;
    //        msgCounter++;
    //    }

    //    void WriteToFile()
    //    {
    //        FileStream fs = new FileStream(getPath(), FileMode.Append, FileAccess.Write, FileShare.Write);
    //        fs.Close();

    //        StreamWriter sw = new StreamWriter(getPath(), true);

    //        sw.Write(string.Join(",", rowDataTemp));


    //        sw.Close();
    //    }

    //    private string getPath()
    //    {
    //#if UNITY_EDITOR
    //        return Application.dataPath + "/Data/saved_data.csv";
    //#elif UNITY_ANDROID
    //        return Application.persistentDataPath+"Saved_data.csv";
    //#elif UNITY_IPHONE
    //        return Application.persistentDataPath+"/"+"Saved_data.csv";
    //#else
    //        return Application.dataPath +"/"+"Saved_data.csv";
    //#endif
    //    }
}
