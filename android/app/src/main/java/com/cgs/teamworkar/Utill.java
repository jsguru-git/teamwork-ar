package com.cgs.teamworkar;

import android.content.Context;
import android.widget.Toast;

public class Utill {

    public static void showToast(Context mContext,String msg){
        Toast.makeText(mContext,""+msg,Toast.LENGTH_SHORT).show();
    }

}
