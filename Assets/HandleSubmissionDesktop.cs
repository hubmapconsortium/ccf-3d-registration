using UnityEngine;
using UnityEngine.UI;

public class HandleSubmissionDesktop : MonoBehaviour
{
    Button btn;

    public delegate void Interact();
    public static event Interact interactEvent;

    // Start is called before the first frame update
    void Start()
    {
        btn = GetComponent<Button>();
        btn.onClick.AddListener(delegate
        {
            if (interactEvent != null)
            {
                interactEvent();
            }
        });
    }
}
