<!DOCTYPE html>
<html lang="en">
<head>
  	<title>Digitization cost calculator</title>
  	<meta charset="utf-8">
    <meta name="description" content="Your description">
 <meta name="keywords" content="state library of north carolina, public libraries, data, inflation, calculator">
 <meta name="author" content="Joyce Chapman">
	<link rel="shortcut icon" href="images/favicon.ico" />
    <link rel="stylesheet" href="css/style.css">
    <script src="js/jquery-1.7.1.min.js"></script>
    <script src="js/superfish.js"></script>
<!--[if lt IE 8]>
   <div style=' clear: both; text-align:center; position: relative;'>
     <a href="http://windows.microsoft.com/en-US/internet-explorer/products/ie/home?ocid=ie6_countdown_bannercode">
       <img src="http://storage.ie6countdown.com/assets/100/images/banners/warning_bar_0000_us.jpg" border="0" height="42" width="820" alt="You are using an outdated browser. For a faster, safer browsing experience, upgrade for free today." />
    </a>
  </div>
<![endif]-->
<!--[if lt IE 9]>
	<script src="js/html5.js"></script>
	<link rel="stylesheet" href="css/ie.css"> 
<![endif]-->


</head>
<body>
<!-- Header -->
<header>
    <div class="inner"><img src="images/DLF-banner.gif"/>
       <!-- <h1 class="logo"><a href="http://www.statelibrary.ncdcr.gov/ld">North Carolina Public Library Data</a></h1>-->
	</div>
  <nav>
     <ul class="sf-menu">
            <li class="current"><a href="/">calculator</a></li>
            <li><a href="/data-notes.php">notes on data</a></li>
            <li><a href="/feedback.php">feedback / data submission</a></li>

		</ul> 
        <div class="clear"></div>
    </nav>
</header>
<!-- Content -->
    <div class="container_24">
    	<div class="grid_24 content-border">
            
            <!--<div class="top-row">
            	<h1 class="aligncenter">Library digitization cost calculator</h1>
            </div>-->
			 <div class="wrapper indent-top">
				<article style="width:870px;" class="grid_23 prefix_1 alpha">
<?php
//ini_set('display_errors', 'On');

//Variables that will be fed by their selection
$linear_feet = 0;
$scanner = '';
$studentpay = 0;
$studentben = 0;
$staffpay = 0;
$staffben = 0;
$metadata = '';
$fastener = '';
$condition = '';
$ip = '';
$sort = '';
$flatten = '';
$fragile = '';
$disbind = '';

//$timeperiod = '';
//$materialtype = '';

//Variables created by program
$fastener_1000 = 75;
$conditionreview_1000 = 26.5;
$ipreview_1000 = 50.3;
$qualitycontrol_1000 = 300.8;
$sort_1000 = 120;
$flatten_1000 = 50;
$fragile_1000 = 150;
$disbind_1000 = 70;

$scan_zeutschel_1000 = 756;
$scan_phaseone_1000 = 976;
$scan_fujitsu_1000 = 144;
$scan_flatbed_1000 = 4000;

$metadata0 = 0;
$metadata1 = 5;
$metadata2 = 25;
$metadata3 = 50;
$metadata4 = 70;

$total_time = 0;
$total_student = 0;
$total_staff = 0;

//$scans_per_item = 0;

if (isset($_POST['linear_feet'])) $linear_feet = $_POST['linear_feet'];
if (isset($_POST['scanner'])) $scanner = $_POST['scanner'];
if (isset($_POST['studentpay'])) $studentpay = $_POST['studentpay'];
if (isset($_POST['studentben'])) $studentben = $_POST['studentben'];
if (isset($_POST['staffpay'])) $staffpay = $_POST['staffpay'];
if (isset($_POST['staffben'])) $staffben = $_POST['staffben'];
if (isset($_POST['metadata'])) $metadata = $_POST['metadata'];
if (isset($_POST['timeperiod'])) $timeperiod = $_POST['timeperiod'];
if (isset($_POST['materialtype'])) $materialtype = $_POST['materialtype'];
if (isset($_POST['scans_per_item'])) $scans_per_item = $_POST['scans_per_item'];
if (isset($_POST['fastener'])) $fastener = $_POST['fastener'];
if (isset($_POST['condition'])) $condition = $_POST['condition'];
if (isset($_POST['ip'])) $ip = $_POST['ip'];
if (isset($_POST['sort'])) $sort = $_POST['sort'];
if (isset($_POST['flatten'])) $flatten = $_POST['flatten'];
if (isset($_POST['fragile'])) $fragile = $_POST['fragile'];
if (isset($_POST['disbind'])) $disbind = $_POST['disbind'];

echo <<<_END
<p>This calculator aggregates available data on the cost and time it takes to perform various activities associated with library digitization. The calculator provides estimates not accuracy, as each institution is different. The tool provides average time and cost information from other institutions who have donated their data to this project. Data is currently limited. This calculator was built by Joyce Chapman, please contact joyce.chapman@duke.edu for more information, or use the <a href="feedback.php">feedback form.</a></p>
<form method='post' action='' style="padding-bottom:10px;">
<table border='0' width='750px' cellpadding='5' cellspacing='5' class="table" style="color:black;border-collapse:separate;">
	
	<tr>
		<td>Types of scanner</td>
		<td align="left">
		<select name='scanner' value="$scanner" type='text'> 
			<option value="Select">Select</option>
			<option 'selected="selected"'>Zeutschel (overhead scanner)</option>
			<option 'selected="selected"'>Fujitsu (sheet-feeder)</option>
			<option 'selected="selected"'>PhaseOne (overhead camera)</option>
			<option 'selected="selected"'>Epson 11000XL (flatbed)</option>
		</select></td>
	</tr>
	
	<tr>
		<td>Extent (linear feet)</td>
		<td align="left">
		<input type='number' step='any' name='linear_feet' value="$linear_feet"/><i> &nbsp;&nbsp;Assumed: 1 lf = 1,200 scans</i>
		</td>
	</tr>
	
	<tr>
		<td>Hourly pay of student workers</td>
		<td align="left"><input type='number' step='any' name='studentpay' value="$studentpay"/><i> &nbsp;&nbsp;E.g., 10.25</i></td>
	</tr>
	
		<tr>
		<td>Student benefits as % of pay</td>
		<td align="left"><input type='number' step='any' name='studentben' value="$studentben"/><i> &nbsp;&nbsp;E.g., 20.3</i></td>
	</tr>
	
	<tr>
		<td>Annual salary of staff member</td>
		<td align="left"><input type='number' step='any' name='staffpay' value="$staffpay"/><i> &nbsp;&nbsp;E.g., 45000</i></td>
	</tr>
	
	<tr>
		<td>Staff benefits as % of pay</td>
		<td align="left"><input type='number' step='any' name='staffben' value="$staffben"/><i></i></td>
	</tr>
	
	<tr>
		<td>Metadata creation</td>
		<td align="left">
		<select name='metadata' value="$metadata" type='text'> 
			<option>Select</option>
			<option>None (or automatically generated metadata)</option>
			<option>Identifier and extent</option>
			<option>General (title, identifier, extent, date, format, location)</option>
			<option>General plus subjects</option>
			<option>General plus subjects and description</option>

		</select></td>
	</tr>
	
	<tr>
		<td>Average number of scans per item</td>
		<td align="left"><input type='number' step='any' name='scans_per_item' value="$scans_per_item"/><i> &nbsp;&nbsp;To calculate metadata creation time (by item, not scan)</i></td>
	</tr>
	
	<tr>
		<td>Include fastener removal?</td>
		<td align="left"><input type='checkbox' name='fastener' value="Yes">Yes</input><i> &nbsp;&nbsp;Calculations will be for removing fasteners from 100% of items</i></td>
	</tr>
	
	<tr>
		<td>Include condition review?</td>
		<td align="left"><input type='checkbox' name='condition' value="Yes">Yes</input><i>  &nbsp;&nbsp;Flagging/pulling materials to be sent to conservation department.</i></td>
	</tr>
	
	<tr>
		<td>Include intellectual property review?</td>
		<td align="left"><input type='checkbox' name='ip' value="Yes">Yes</input><i> &nbsp;&nbsp;Calculations will be for review of 100% of items</i></td>
	</tr>
	
	<tr>
		<td>Include time to sort materials into items?</td>
		<td align="left"><input type='checkbox' name='sort' value="Yes">Yes</input><i> &nbsp;&nbsp;E.g., locate pp. 1-5 of a discrete document and place them together</i></td>
	</tr>
	
	<tr>
		<td>Include flattening/supporting materials pre-scanning?</td>
		<td align="left"><input type='checkbox' name='flatten' value="Yes">Yes</input><i> &nbsp;&nbsp;This will be calculated as if it were done for 100% of items</i></td>
	</tr>
	
	<tr>
		<td>Include time for fragile item handling?</td>
		<td align="left"><input type='checkbox' name='fragile' value="Yes">Yes</input><i> &nbsp;&nbsp;This will be calculated as if 100% of items are fragile</i></td>
	</tr>
	
	<tr>
		<td>Include time for disbinding and rebinding items?</td>
		<td align="left"><input type='checkbox' name='disbind' value="Yes">Yes</input><i> &nbsp;&nbsp;This will be calculated as if it 100% of items need disbinding</i></td>
	</tr>

  <tr class="submit">
	<td/>
	<td align="left">
		<input type='submit' name='inflation-submit' value='Calculate' style='width:100px; height:30px; font-size:15px;'/>
	</td>
  </tr>
</table>
</form>
_END;


if ($scanner == null) {
// do nothing, no data has been submitted
} elseif ($scanner == "Select") {
	echo '<p style="color:red;font-size:14px">Please select a type of scanner!</p>';
} else {
	$extent = $linear_feet * 1200;
	$student_cost_hourly = $studentpay + $studentpay * $studentben;
	$staff_cost_hourly = ($staffpay + $staffpay * $staffben)/2080;
	
	$fastener_hour = number_format((($extent/1000) * $fastener_1000)/60,1);
	$fastener_student = number_format(((($extent/1000) * $fastener_1000)/60) * $student_cost_hourly,0);
	$fastener_staff = number_format(((($extent/1000) * $fastener_1000)/60) * $staff_cost_hourly,0);
	
	$condition_hour = number_format((($extent/1000) * $conditionreview_1000)/60,1);
	$condition_student = number_format(((($extent/1000) * $conditionreview_1000)/60) * $student_cost_hourly,0);
	$condition_staff = number_format(((($extent/1000) * $conditionreview_1000)/60) * $staff_cost_hourly,0);
	
	$ip_hour = number_format((($extent/1000) * $ipreview_1000)/60,1);
	$ip_student = number_format(((($extent/1000) * $ipreview_1000)/60) * $student_cost_hourly,0);
	$ip_staff = number_format(((($extent/1000) * $ipreview_1000)/60) * $staff_cost_hourly,0);
	
	$sort_hour = number_format((($extent/1000) * $sort_1000)/60,1);
	$sort_student = number_format(((($extent/1000) * $sort_1000)/60) * $student_cost_hourly,0);
	$sort_staff = number_format(((($extent/1000) * $sort_1000)/60) * $staff_cost_hourly,0);
	
	$flatten_hour = number_format((($extent/1000) * $flatten_1000)/60,1);
	$flatten_student = number_format(((($extent/1000) * $flatten_1000)/60) * $student_cost_hourly,0);
	$flatten_staff = number_format(((($extent/1000) * $flatten_1000)/60) * $staff_cost_hourly,0);
	
	$fragile_hour = number_format((($extent/1000) * $fragile_1000)/60,1);
	$fragile_student = number_format(((($extent/1000) * $fragile_1000)/60) * $student_cost_hourly,0);
	$fragile_staff = number_format(((($extent/1000) * $fragile_1000)/60) * $staff_cost_hourly,0);
	
	$disbind_hour = number_format((($extent/1000) * $disbind_1000)/60,1);
	$disbind_student = number_format(((($extent/1000) * $disbind_1000)/60) * $student_cost_hourly,0);
	$disbind_staff = number_format(((($extent/1000) * $disbind_1000)/60) * $staff_cost_hourly,0);
	
	$zeutschel_hour = number_format((($extent/1000) * $scan_zeutschel_1000)/60,1);
	$zeutschel_student = number_format(((($extent/1000) * $scan_zeutschel_1000)/60) * $student_cost_hourly,0);
	$zeutschel_staff = number_format(((($extent/1000) * $scan_zeutschel_1000)/60) * $staff_cost_hourly,0);
	
	$phaseone_hour = number_format((($extent/1000) * $scan_phaseone_1000)/60,1);
	$phaseone_student = number_format(((($extent/1000) * $scan_phaseone_1000)/60) * $student_cost_hourly,0);
	$phaseone_staff = number_format(((($extent/1000) * $scan_phaseone_1000)/60) * $staff_cost_hourly,0);
	
	$fujitsu_hour = number_format((($extent/1000) * $scan_fujitsu_1000)/60,1);
	$fujitsu_student = number_format(((($extent/1000) * $scan_fujitsu_1000)/60) * $student_cost_hourly,0);
	$fujitsu_staff = number_format(((($extent/1000) * $scan_fujitsu_1000)/60) * $staff_cost_hourly,0);
	
	$flatbed_hour = number_format((($extent/1000) * $scan_flatbed_1000)/60,1);
	$flatbed_student = number_format(((($extent/1000) * $scan_flatbed_1000)/60) * $student_cost_hourly,0);
	$flatbed_staff = number_format(((($extent/1000) * $scan_flatbed_1000)/60) * $staff_cost_hourly,0);
	
	$qualitycontrol_hour = number_format((($extent/1000) * $qualitycontrol_1000)/60,1);
	$qualitycontrol_student = number_format(((($extent/1000) * $qualitycontrol_1000)/60) * $student_cost_hourly,0);
	$qualitycontrol_staff = number_format(((($extent/1000) * $qualitycontrol_1000)/60) * $staff_cost_hourly,0);


	echo 
	'<div "color:black;"><h3>Results</h3><p style="font-size:14px;">You told us you plan to scan <b>' . number_format($linear_feet,0) . ' linear feet</b> of material on a <b>' . $scanner .'</b>. We\'ve multipled that out at a rate of 1,200 scans per linear foot and estimated you\'ll be creating around <b>' . number_format($extent,0) . '</b> scans. You also told us you would like to estimate the time and cost of creating the following type of metadata: <b>"' . $metadata . '"</b> for each item, and that your materials average <b>' . $scans_per_item . '</b> scans per item.</p>
	
<p>
<table style="width:100%; text-align: left; float: left; font-size:14px;">
  <tr>
    <th>Activity</th>
    <th>Time (in hours)</th> 
    <th>Cost (student)</th>
    <th>Cost (staff)</th>
  </tr>
';
    if ($fastener == 'Yes') {
    $total_time=$total_time + $fastener_hour;
    echo '<tr>
    <td>Fastener removal</td>
    <td>' . $fastener_hour . '</td> 
    <td>$' . $fastener_student . '</td>
    <td>$' . $fastener_staff . '</td>
  </tr>';
  }
    if ($condition == 'Yes') {
    $total_time=$total_time + $condition_hour;
    echo '<tr>
    <td>Condition review</td>
    <td>' . $condition_hour . '</td> 
    <td>$' . $condition_student . '</td>
    <td>$' . $condition_staff . '</td>
  </tr>';
  }
    if ($ip == 'Yes') {
    $total_time=$total_time + $ip_hour;
  echo '<tr>
    <td>Intellectual property review</td>
    <td>' . $ip_hour . '</td> 
    <td>$' . $ip_student . '</td>
    <td>$' . $ip_staff . '</td>
  </tr>';
  }
  if ($sort == 'Yes') {
  $total_time=$total_time + $sort_hour;
  echo '<tr>
    <td>Sort into items</td>
    <td>' . $sort_hour . '</td> 
    <td>$' . $sort_student . '</td>
    <td>$' . $sort_staff . '</td>
  </tr>';
  }
  if ($flatten == 'Yes') {
  $total_time=$total_time + $flatten_hour;
  echo '<tr>
    <td>Flatten/support items</td>
    <td>' . $flatten_hour . '</td> 
    <td>$' . $flatten_student . '</td>
    <td>$' . $flatten_staff . '</td>
  </tr>';
  }
  if ($fragile == 'Yes') {
    $total_time=$total_time + $fragile_hour;
  echo '<tr>
    <td>Fragile item handling</td>
    <td>' . $fragile_hour . '</td> 
    <td>$' . $fragile_student . '</td>
    <td>$' . $fragile_staff . '</td>
  </tr>';
  }
  if ($disbind == 'Yes') {
    $total_time=$total_time + $disbind_hour;
  echo '<tr>
    <td>Disbind/rebind</td>
    <td>' . $disbind_hour . '</td> 
    <td>$' . $disbind_student . '</td>
    <td>$' . $disbind_staff . '</td>
  </tr>';
  }
  echo '<tr>
    <td>Digitization</td>';
    if ($scanner == 'Zeutschel (overhead scanner)') {
    $total_time=$total_time + $zeutschel_hour;
    	echo '<td>' . $zeutschel_hour . '</td> 
    	<td>$' . $zeutschel_student . '</td>
    	<td>$' . $zeutschel_staff . '</td>';
    } elseif ($scanner == 'PhaseOne (overhead camera)') {
    $total_time=$total_time + $phaseone_hour;
    	echo '<td>' . $phaseone_hour . '</td> 
    	<td>$' . $phaseone_student . '</td>
    	<td>$' . $phaseone_staff . '</td>';
    } elseif ($scanner == 'Fujitsu (sheet-feeder)') {
        $total_time=$total_time + $fujitsu_hour;
    	echo '<td>' . $fujitsu_hour . '</td> 
    	<td>$' . $fujitsu_student . '</td>
    	<td>$' . $fujitsu_staff . '</td>';
    } elseif ($scanner == 'Epson 11000XL (flatbed') {
        $total_time=$total_time + $flatbed_hour;
    	echo '<td>' . $flatbed_hour . '</td> 
    	<td>$' . $flatbed_student . '</td>
    	<td>$' . $flatbed_staff . '</td>';
    }
     $total_time=$total_time + $qualitycontrol_hour;
  echo '</tr>
  <tr>
    <td>Quality control</td>
    <td>' . $qualitycontrol_hour . '</td> 
    <td>$' . $qualitycontrol_student . '</td>
    <td>$' . $qualitycontrol_staff . '</td>
  </tr>
  <tr>
    <td>Metadata creation</td>';
    if ($metadata == 'None (or automatically generated metadata)') {
    	echo '<td>0</td> 
    <td>$0</td>
    <td>$0</td>';
    } elseif ($metadata == 'Identifier and extent'){
       $total_time=$total_time + (number_format((($extent/$scans_per_item)*$metadata1)/60,1));
    	echo '<td>' . number_format((($extent/$scans_per_item)*$metadata1)/60,1) . '</td> 
    <td>$' . number_format(((($extent/$scans_per_item)*$metadata1)/60)* 	$student_cost_hourly,0) . '</td>
    <td>$' . number_format(((($extent/$scans_per_item)*$metadata1)/60)* $staff_cost_hourly,0) . '</td>';
    } elseif ($metadata == 'General (title, identifier, extent, date, format, location)'){
    	$total_time=$total_time + (number_format((($extent/$scans_per_item)*$metadata2)/60,1));
    	echo '<td>' . number_format((($extent/$scans_per_item)*$metadata2)/60,1) . '</td> 
    <td>$' . number_format(((($extent/$scans_per_item)*$metadata2)/60)* 	$student_cost_hourly,0) . '</td>
    <td>$' . number_format(((($extent/$scans_per_item)*$metadata2)/60)* $staff_cost_hourly,0) . '</td>';
    } elseif ($metadata == 'General plus subjects'){
    	$total_time=$total_time + (number_format((($extent/$scans_per_item)*$metadata3)/60,1));
    	echo '<td>' . number_format((($extent/$scans_per_item)*$metadata3)/60,1) . '</td> 
    <td>$' . number_format(((($extent/$scans_per_item)*$metadata3)/60)* 	$student_cost_hourly,0) . '</td>
    <td>$' . number_format(((($extent/$scans_per_item)*$metadata3)/60)* $staff_cost_hourly,0) . '</td>';
    } elseif ($metadata == 'General plus subjects and description') {
    	$total_time=$total_time + (number_format((($extent/$scans_per_item)*$metadata4)/60,1));
    	echo '<td>' . number_format((($extent/$scans_per_item)*$metadata4)/60,1) . '</td> 
    <td>$' . number_format(((($extent/$scans_per_item)*$metadata4)/60)* 	$student_cost_hourly,0) . '</td>
    <td>$' . number_format(((($extent/$scans_per_item)*$metadata4)/60)* $staff_cost_hourly,0) . '</td>';
    }
    
$total_student = $total_time * $student_cost_hourly;
$total_staff = $total_time * $staff_cost_hourly;
    
  echo '</tr>
  <tr style =\'border-top:thin solid;\'>
    <td><b>Total</b></td>
     <td><b>' . number_format($total_time,0) . '</b></td> 
    <td><b>$' . number_format($total_student,0) . '</b></td>
    <td><b>$' . number_format($total_staff,0) . '</b></td>
  </b></tr>
</table>
</p>';

 } // end if for inflation values
 

?>
<!--<p>  </p>
<hr/>
<p id="bottom"><b>HOW THIS WAS CALCULATED:</b> The calculator uses data from the University of Alabama digital production center, Duke University Libraries, and the Triangle Research Libraries Network consortial grant project "Content Context and Capacity: A Collaborative Large-scale Digitization Project on the Long Civil Rights Movement in North Carolina." </a></p>-->
		</article>
      </div>      
        </div>
        <div class="clear"></div>
    </div>
</section>
<aside>
	<div class="container_24">
    	<div class="wrapper">
        	<div class="grid_24 aside-bg">

            </div>
        </div>
    </div>
</aside>
<!-- Footer -->
<footer>
    <div class="copyright">                   		

       <!--&copy; 2013 <strong>State Library of North Carolina</strong>-->
    </div>
</footer>

<!-- I tried this to make the Results section appear/disappear 
<script >
function showDiv() {
   document.getElementById('results').style.display = "block";
}
</script>-->
</body>
</html>
