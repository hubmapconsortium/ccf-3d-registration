using System.Collections;
using System.IO;
using UnityEngine;

public class DataLogger : MonoBehaviour
{

    public enum Condition { Desktop, Standup, Tabletop, Testing };
    //data
    public Condition cond;
    bool isExperimentRunning = true;
    public string userName;
    int taskNumber;
    PromptType f;
    ExperimentState es;
    float elapsedTime;
    public GameObject headset;
    public GameObject controllerLeft;
    public GameObject controllerRight;
    string headsetPos;
    string controllerLeftPos;
    string controllerRightPos;
    public float distance;
    int taskID;
    string objectName;
    public Transform kidney;
    GameObject currentSliver;
    GameObject currentTarget;
    public float angle;
    string button = "";
    string side = "";
    string status = "";
    //string grabLeftStatus;
    //string menuLeftStatus;
    //string touchpadLeftStatus;



    string dateTimeAtStart;

    public float logInterval = 1f;
    public TaskManager tm;


    //logic
    bool isRunning = false;
    public bool isDataLogOn = false;

    void OnEndOfSessionStopLogging()
    {
        isExperimentRunning = false;
    }

    private void Start()
    {
        dateTimeAtStart = GiveDateTime();
        //Debug.Log(dateTimeAtStart);

        if (isDataLogOn)
        {
            SetupCSV();
        }

    }


    void Update()
    {
        UpdateData();

        if (isDataLogOn && isExperimentRunning)
        {
            if (!isRunning) StartCoroutine(LogMessage());
        }
        //if (Input.GetKeyDown(KeyCode.A))
        //{
        //    StartCoroutine(LogMessage(KeyCode.A.ToString()));
        //}
    }

    public void UpdateData()
    {
        taskNumber = tm.taskNumber;
        f = tm.prompt;
        es = tm.state;
        elapsedTime += Time.deltaTime;
        currentSliver = tm.currentSliver;
        currentTarget = tm.currentTarget;
        distance = Vector3.Distance(
                    currentSliver.transform.position,
                    currentTarget.transform.position
                    );
        taskID = tm.taskID;
        objectName = currentSliver.name;
        angle = Quaternion.Angle(currentTarget.transform.rotation, currentSliver.transform.rotation);

    }

    public IEnumerator LogMessage()
    {
        AddRecord(GetPath());
        isRunning = true;
        yield return new WaitForSeconds(logInterval);
        isRunning = false;
    }

    public void ControllerInputListener(string btn, string si, string stat)
    {
        button = btn;
        side = si;
        status = stat;
        //Debug.Log("received " + btn + " and " + si + " and " + stat);

        //Add a record
        AddRecord(GetPath());
        ResetButtonData();
    }

    void ResetButtonData()
    {
        button = "";
        side = "";
        status = "";
    }

    public void AddRecord(string filepath)
    {
        using (StreamWriter file = new StreamWriter(filepath, true))
        {
            file.WriteLine(
           FormatMessage()
            );
        }
    }

    string FormatMessage()
    {
        if (cond == Condition.Standup)
        {
            return userName + ","
                + cond + ","
                + taskNumber + ","
                + f + ","
                + es + ","
                + elapsedTime + ","
                + headset.transform.position.x + ","
                + headset.transform.position.y + ","
                + headset.transform.position.z + ","
                + controllerLeft.transform.position.x + ","
                + controllerLeft.transform.position.y + ","
                + controllerLeft.transform.position.z + ","
                + controllerRight.transform.position.x + ","
                + controllerRight.transform.position.y + ","
                + controllerRight.transform.position.z + ","
                + distance + ","
                + taskID + ","

                + currentSliver.transform.position.x + ","
                + currentSliver.transform.position.y + ","
                + currentSliver.transform.position.z + ","
                + currentTarget.transform.position.x + ","
                + currentTarget.transform.position.y + ","
                + currentTarget.transform.position.z + ","
                + currentSliver.transform.localScale.x + ","
                + currentSliver.transform.localScale.y + ","
                + currentSliver.transform.localScale.z + ","
                + currentSliver.transform.rotation.eulerAngles.x + ","
                + currentSliver.transform.rotation.eulerAngles.y + ","
                + currentSliver.transform.rotation.eulerAngles.z + ","
                + currentTarget.transform.rotation.eulerAngles.x + ","
                + currentTarget.transform.rotation.eulerAngles.y + ","
                + currentTarget.transform.rotation.eulerAngles.z + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentSliver.transform).x + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentSliver.transform).y + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentSliver.transform).z + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentTarget.transform).x + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentTarget.transform).y + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentTarget.transform).z + ","

                + angle + ","
                + button + ","
                + side + ","
                + status
                ;
        }
        else if (cond == Condition.Desktop)
        {
            Transform previewCamera = GameObject.Find("PreviewCamera").GetComponent<Camera>().transform;
            return userName + ","
                + cond + ","
                + taskNumber + ","
                + f + ","
                + es + ","
                + elapsedTime + ","
                + headset.transform.position.x + ","
                + headset.transform.position.y + ","
                + headset.transform.position.z + ","
                + previewCamera.transform.position.x + ","
                + previewCamera.transform.position.y + ","
                + previewCamera.transform.position.z + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(previewCamera).x + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(previewCamera).y + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(previewCamera).z + ","
                + previewCamera.GetComponent<Camera>().fieldOfView + ","
                + distance + ","
                + taskID + ","

                + currentSliver.transform.position.x + ","
                + currentSliver.transform.position.y + ","
                + currentSliver.transform.position.z + ","
                + currentTarget.transform.position.x + ","
                + currentTarget.transform.position.y + ","
                + currentTarget.transform.position.z + ","
                + currentSliver.transform.localScale.x + ","
                + currentSliver.transform.localScale.y + ","
                + currentSliver.transform.localScale.z + ","
                + currentSliver.transform.rotation.eulerAngles.x + ","
                + currentSliver.transform.rotation.eulerAngles.y + ","
                + currentSliver.transform.rotation.eulerAngles.z + ","
                + currentTarget.transform.rotation.eulerAngles.x + ","
                + currentTarget.transform.rotation.eulerAngles.y + ","
                + currentTarget.transform.rotation.eulerAngles.z + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentSliver.transform).x + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentSliver.transform).y + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentSliver.transform).z + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentTarget.transform).x + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentTarget.transform).y + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentTarget.transform).z + ","
                + angle + ","
                + Input.mousePosition.x + ","
                + Input.mousePosition.y + ","
                + button + ","
                + side + ","
                + status
                ;
        }
        else if (cond == Condition.Tabletop)
        {
            return userName + ","
                + cond + ","
                + taskNumber + ","
                + f + ","
                + es + ","
                + elapsedTime + ","
                + headset.transform.position.x + ","
                + headset.transform.position.y + ","
                + headset.transform.position.z + ","
                + controllerLeft.transform.position.x + ","
                + controllerLeft.transform.position.y + ","
                + controllerLeft.transform.position.z + ","
                + controllerRight.transform.position.x + ","
                + controllerRight.transform.position.y + ","
                + controllerRight.transform.position.z + ","
                + distance + ","
                + taskID + ","
                + kidney.rotation.eulerAngles.x + ","
                + kidney.rotation.eulerAngles.y + ","
                + kidney.rotation.eulerAngles.z + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(kidney).x + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(kidney).y + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(kidney).z + ","
                + currentSliver.transform.position.x + ","
                + currentSliver.transform.position.y + ","
                + currentSliver.transform.position.z + ","
                + currentTarget.transform.position.x + ","
                + currentTarget.transform.position.y + ","
                + currentTarget.transform.position.z + ","
                + currentSliver.transform.localScale.x + ","
                + currentSliver.transform.localScale.y + ","
                + currentSliver.transform.localScale.z + ","
                + currentSliver.transform.rotation.eulerAngles.x + ","
                + currentSliver.transform.rotation.eulerAngles.y + ","
                + currentSliver.transform.rotation.eulerAngles.z + ","
                + currentTarget.transform.rotation.eulerAngles.x + ","
                + currentTarget.transform.rotation.eulerAngles.y + ","
                + currentTarget.transform.rotation.eulerAngles.z + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentSliver.transform).x + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentSliver.transform).y + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentSliver.transform).z + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentTarget.transform).x + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentTarget.transform).y + ","
                //+ UnityEditor.TransformUtils.GetInspectorRotation(currentTarget.transform).z + ","

                + angle + ","
                + button + ","
                + side + ","
                + status
                ;
        }
        else
        {
            return "";
        }

    }

    private void OnEnable()
    {
        ControllerGrabObject.ControllerUseEvent += ControllerInputListener;
        ControllerControlUI.ControllerUseEvent += ControllerInputListener;
        ControllerResetSliver.ControllerUseEvent += ControllerInputListener;
        ControllerTabletopLeft.TouchPadPressActionEvent += ControllerInputListener;
        HandleSubmission.ControllerUseEvent += ControllerInputListener;
        DragWithMouse.MouseUseEvent += ControllerInputListener;
        UIInputListener.ButtonPressEvent += ControllerInputListener;
        TaskManager.EndOfSessionEvent += OnEndOfSessionStopLogging;
    }

    private void OnDisable()
    {
        ControllerGrabObject.ControllerUseEvent -= ControllerInputListener;
        ControllerControlUI.ControllerUseEvent -= ControllerInputListener;
        ControllerResetSliver.ControllerUseEvent -= ControllerInputListener;
        ControllerTabletopLeft.TouchPadPressActionEvent -= ControllerInputListener;
        HandleSubmission.ControllerUseEvent -= ControllerInputListener;
        DragWithMouse.MouseUseEvent -= ControllerInputListener;
        UIInputListener.ButtonPressEvent -= ControllerInputListener;
        TaskManager.EndOfSessionEvent -= OnEndOfSessionStopLogging;
    }

    public void SetupCSV()
    {
        using (StreamWriter file = new StreamWriter(GetPath(), true))

        {
            if (cond == Condition.Standup)
            {
                file.WriteLine(
               "userName" + ","
               + "condition" + ","
               + "taskNumber" + ","
               + "focus" + ","
               + "ExperimentState" + ","
               + "elapsedTime" + ","
               + "headsetX" + ","
               + "headsetY" + ","
               + "headsetZ" + ","
               + "ControllerLeftX" + ","
               + "ControllerLeftY" + ","
               + "ControllerLeftZ" + ","
               + "ControllerRightX" + ","
               + "ControllerRightY" + ","
               + "ControllerRightZ" + ","
               + "distance" + ","
               + "taskID" + ","

               + "currentSliver.transform.position.x" + ","
               + "currentSliver.transform.position.y" + ","
               + "currentSliver.transform.position.z" + ","
               + "currentTarget.transform.position.x" + ","
               + "currentTarget.transform.position.y" + ","
               + "currentTarget.transform.position.z" + ","
               + "objectXLength" + ","
               + "objectYLength" + ","
               + "objectZLength" + ","
               + "currentObjectRotationX" + ","
               + "currentObjectRotationY" + ","
               + "currentObjectRotationZ" + ","
               + "targetRotationX" + ","
               + "targetRotationY" + ","
               + "targetRotationZ" + ","
               + "currentObjectRotationXInspector" + ","
               + "currentObjectRotationYInspector" + ","
               + "currentObjectRotationZInspector" + ","
               + "targetRotationXInspector" + ","
               + "targetRotationYInspector" + ","
               + "targetRotationZInspector" + ","
               + "angle" + ","
               + "button" + ","
               + "side" + ","
               + "status"
               );
            }
            else if (cond == Condition.Desktop)
            {
                file.WriteLine(
               "userName" + ","
               + "condition" + ","
               + "taskNumber" + ","
               + "focus" + ","
               + "ExperimentState" + ","
               + "elapsedTime" + ","
               + "headsetX" + ","
               + "headsetY" + ","
               + "headsetZ" + ","
               + "3DCameraXPos" + ","
                + "3DCameraYPos" + ","
                + "3DCameraZPos" + ","
                + "3DCameraXRot" + ","
                + "3DCameraYRot" + ","
                + "3DCameraZRot" + ","
                + "FOV" + ","
               + "distance" + ","
               + "taskID" + ","

               + "currentSliver.transform.position.x" + ","
               + "currentSliver.transform.position.y" + ","
               + "currentSliver.transform.position.z" + ","
               + "currentTarget.transform.position.x" + ","
               + "currentTarget.transform.position.y" + ","
               + "currentTarget.transform.position.z" + ","
               + "objectXLength" + ","
               + "objectYLength" + ","
               + "objectZLength" + ","
               + "currentObjectRotationX" + ","
               + "currentObjectRotationY" + ","
               + "currentObjectRotationZ" + ","
               + "targetRotationX" + ","
               + "targetRotationY" + ","
               + "targetRotationZ" + ","
               + "currentObjectRotationXInspector" + ","
               + "currentObjectRotationYInspector" + ","
               + "currentObjectRotationZInspector" + ","
               + "targetRotationXInspector" + ","
               + "targetRotationYInspector" + ","
               + "targetRotationZInspector" + ","
               + "angle" + ","
               + "mouseX" + ","
               + "mouseY" + ","
               + "button" + ","
               + "side" + ","
               + "status"
               );
            }
            else if (cond == Condition.Tabletop)
            {
                file.WriteLine(
               "userName" + ","
               + "condition" + ","
               + "taskNumber" + ","
               + "focus" + ","
               + "ExperimentState" + ","
               + "elapsedTime" + ","
               + "headsetX" + ","
               + "headsetY" + ","
               + "headsetZ" + ","
               + "ControllerLeftX" + ","
               + "ControllerLeftY" + ","
               + "ControllerLeftZ" + ","
               + "ControllerRightX" + ","
               + "ControllerRightY" + ","
               + "ControllerRightZ" + ","
               + "distance" + ","
               + "taskID" + ","
               + "kidney.rotation.eulerAngles.x" + ","
                + "kidney.rotation.eulerAngles.y" + ","
                + "kidney.rotation.eulerAngles.z" + ","
                + "UnityEditor.TransformUtils.GetInspectorRotation(kidney).x" + ","
                + "UnityEditor.TransformUtils.GetInspectorRotation(kidney).y" + ","
                + "UnityEditor.TransformUtils.GetInspectorRotation(kidney).z" + ","
               + "currentSliver.transform.position.x" + ","
               + "currentSliver.transform.position.y" + ","
               + "currentSliver.transform.position.z" + ","
               + "currentTarget.transform.position.x" + ","
               + "currentTarget.transform.position.y" + ","
               + "currentTarget.transform.position.z" + ","
               + "objectXLength" + ","
               + "objectYLength" + ","
               + "objectZLength" + ","
               + "currentObjectRotationX" + ","
               + "currentObjectRotationY" + ","
               + "currentObjectRotationZ" + ","
               + "targetRotationX" + ","
               + "targetRotationY" + ","
               + "targetRotationZ" + ","
               + "currentObjectRotationXInspector" + ","
               + "currentObjectRotationYInspector" + ","
               + "currentObjectRotationZInspector" + ","
               + "targetRotationXInspector" + ","
               + "targetRotationYInspector" + ","
               + "targetRotationZInspector" + ","
               + "angle" + ","
               + "button" + ","
               + "side" + ","
               + "status"
               );
            }

        }
    }

    private string GetPath()
    {
#if UNITY_EDITOR
        return Application.dataPath + "/Data/RUI_VR/" + cond + "/" + userName + " " + cond + " " + dateTimeAtStart + ".csv";
#elif UNITY_ANDROID
        return Application.persistentDataPath+"Saved_data.csv";
#elif UNITY_IPHONE
        return Application.persistentDataPath+"/"+"Saved_data.csv";
#else
        return Application.dataPath +"/"+"Saved_data.csv";
#endif
    }

    string GiveDateTime()
    {
        dateTimeAtStart = System.DateTime.Now.ToString();
        dateTimeAtStart = dateTimeAtStart.Replace(':', '_');
        dateTimeAtStart = dateTimeAtStart.Replace('/', '.');
        return dateTimeAtStart;
    }

}
